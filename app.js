
const config = require('./conf/config.json');
process.env.TZ = 'Asia/Seoul';
process.env.NODE_ENV = ( config.nodeENV == undefined) ? 'local' : config.nodeENV;
global.serviceName = (config.mainPath).trim().toUpperCase();

const baseObject = require('./com/baseObject').prototype;  //로그함수를 사용하기위한 참조

let cluster = require('cluster');
let os = require('os');
let uuid = require('uuid');
var instanceId = uuid.v4();

var cpuCount = os.cpus().length; //CPU 수
var workerCount = 1;         //현재 1개로 지정[ Ex.) cpuCount / 2 : 2개의 컨테이너에 돌릴 예정 CPU수 / 2]
var worker = undefined;      //워커
var worker_id = undefined;   //워커 ID
let tryCnt = 0;              //예외상황으로 인해 워커 재생성(자동 재기동)시 재기동 시도 Count 변수

if (cluster.isMaster) { 
    baseObject._debugLog(['Server ID :',  instanceId]);
    baseObject._debugLog(['Server CPU Count :',  cpuCount]);
    baseObject._debugLog(['Create Worker Count :',  workerCount]);
    baseObject._debugLog([`${workerCount} :`,  '개의 Worker Created.']);

    //Worker 메시지 리스너
    var workerMsgListener = function(msg) {
        worker_id = msg.worker_id;
        if (msg.cmd === 'MASTER_ID') {
            //마스터 아이디 요청
            cluster.workers[worker_id].send({cmd:'MASTER_ID',master_id: instanceId});
        }
    }
    
    //CPU 수 만큼 Worker 생성
    for (var i = 0; i < workerCount; i++) {
        baseObject._debugLog(['Worker Create :', `${(i + 1)} / ${workerCount}`]);
        worker = cluster.fork();
        worker.on('message', workerMsgListener); //Worker의 요청메시지 리스너
    }
    
    //Worker가 online상태가 되었을때
    cluster.on('online', function(worker) {
        baseObject._debugLog(['Worker Online - Worker PID :', `[ ${worker.process.pid} ]`]);
    });
    
    //Worker가 죽었을 경우 Refork(다시 살림)
    cluster.on('exit', function(worker) {
        tryCnt++;
        baseObject._debugLog(['Worker Kill - Killed Worker PID :', `[ ${worker.process.pid} ]`]);
        baseObject._debugLog([`Orther Worker Create. [Try Count : ${tryCnt}]`]);

        worker = cluster.fork();        
        worker.on('message', workerMsgListener); //Worker의 요청메시지 리스너

        if (tryCnt == 5) {
            process.exit();
        }
    });    
} else if (cluster.isWorker) {
    //var master_id = undefined;
    worker_id = cluster.worker;
    process.send({worker_id: worker_id.id, cmd:'MASTER_ID'});
    /*
    process.on('Message', function(msg) {
        master_id = msg.cmd === 'MASTER_ID' ? master_id = msg.master_id : undefined;
    });
    //console.log(`Server -> Worker [${worker_id}]`);
    */
    
    //Express initialize
    const appManager = require('./manager/appManager');
    appManager.initExpress(worker_id);
}

