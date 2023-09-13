import http from "http";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import axios from "axios";
import amqp  from "amqplib";
import bodyParser from "body-parser";
var port = process.env.PORT || 8080;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
const server = http.createServer(app);

var channel, connection;  //global variables

var statusSocket = false;

connectQueue();

async function connectQueue() {   
    try {
        //amqp://user:pass@host.com/vhost
        connection = await amqp.connect("amqp://esn:esn123@10.22.224.222:5672");
        channel    = await connection.createChannel()
        
        await channel.assertQueue("esn-queue")

        await channel.consume("esn-queue", data => {
            console.log('data received from mq')

            if (data) {
                console.log(
                  JSON.parse(data.content.toString()).data
                );
              }

            // console.log(`${Buffer.from(data.content)}`)
            // let datafrommq = `${Buffer.from(data.content)}`;
            // console.log('dataid: ' + `${Buffer.from(data.content)}`);
            io.emit(JSON.parse(data.content.toString()).name, JSON.parse(data.content.toString()).data);
            channel.ack(data);
        })
        
    } catch (error) {
        console.log(error)
    }
}


async function sendData (data) {
    // send data to queue

    await channel.sendToQueue("esn-queue", Buffer.from(JSON.stringify(data)));
        
    // close the channel and connection
    // await channel.close();
    // await connection.close(); 
}

const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

app.use(cors());


async function getBattleDataRecursive (payload, name) {

    axios.post('http://esportsdata.mobilelegends.com:30260/battledata?authkey=6646f93ab8cf795f3f78a7ed73469cf7&battleid='+ payload.battleid +'&dataid=0', payload)
    .then(response => {
    // Handle the API response
    console.log("get battle data id: " +  response.data.dataid);

    const dt = {
        name: "",
        data: null
      };


      dt.name = name;
      dt.data =  response.data;

    sendData(dt);
    //sendData(response.data);  // pass the data to the function we defined
    console.log("A message is sent to queue");

    // let payload = { authkey: '6646f93ab8cf795f3f78a7ed73469cf7', battleid: response.data.dataid.battleid,  dataid: 0};

    if(statusSocket){

        payload.dataid = response.data.dataid;

        console.log('payload.dataid: ' + payload.dataid);

        getBattleDataRecursive(payload, name);
    }
    

    // io.emit("battle data", response.data);
    })
    .catch(error => {
        io.emit("battle data", "not found");
        console.log(error);
    // Handle any errors
    // res.status(500).json({ error: 'An error occurred' });
    });

}

app.post('/battle/:battleId', (req, res) => {

    // let battleId = req.params.battleId;

    console.log("battleid: " + req.params.battleId);

    console.log('name: ' + req.body.name + ' status: ' + req.body.status);

    statusSocket = req.body.status;

    let payload = { authkey: '6646f93ab8cf795f3f78a7ed73469cf7', battleid: req.params.battleId,  dataid: 0};

    getBattleDataRecursive(payload, req.body.name);

    res.json({requestBody: req.body})  // <==== req.body will be a parsed JSON object
  })




io.on("connection", (socket) => {
    console.log("socket connected");
   
    socket.on("disconnect", () => {
        console.log("socket disconnected");
    });
});

server.listen(8080, () => {
    console.log(`listening on *:${port}`);
});

var currentdate = new Date(); 
console.log("test" + currentdate);
