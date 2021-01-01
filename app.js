const fs=require('fs');
const express=require('express');
const bodyParser = require('body-parser');
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');
const app=express();
const file_path="./db/student.txt";


var userAvaliable;
var totalUser=0;

//FILE OPERATION
try {
    if (fs.existsSync(file_path)) {
      //file exists
    }
    else{
       // File not present -> Create one
       fs.writeFile('./db/student.txt', '' , function (err) {
        if (err) throw err;
        console.log('File Created with name : Student.txt');
      });
    }
  } 
  catch(err) {
    console.error(err)
  }

// ARRAY TO STORE JSON OBJECT
const arr=[]

// MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: true })); 7

// STUDENT OBJECT
const student={
    id:String,
    name:String,
    age:Number,
    time_to_leave:Number 
}

function storeInDb(arr){
    fs.writeFile('./db/student.txt', JSON.stringify(arr), function (err) {
        if (err) throw err;
        console.log('Database Updated!!!');
      });
}

// CREATE 
function createStudent(id,name,age,time_to_leave){
    const s=Object.create(student);
    var status=true;
    for(i=0;i<arr.length;i++){
        if(arr[i]["id"]==id){
            status=false;
            console.log("Student Already Exists With ID : "+id);
            break;
        }
    }
    if(status==true){
        if(time_to_leave!=""){
            setTimeout(()=>{
                deleteKeyValue(id)
            },time_to_leave*1000);
            s.id=id
            s.name=name;
            s.age=age;
            s.time_to_leave=time_to_leave;
        }
        else{
            s.id=id;
            s.name=name;
            s.age=age;
        }
        arr.push(s)
        storeInDb(arr);
    }
}

// CALLBACK FUNCTION
function callback(){ }

function listener(proceed){
    if(proceed==true){
        callback();
    }
}

// DELETE STUDENT BY ID
function deleteKeyValue(id){
        const index=arr.findIndex((e)=>{
            return e.id===id;
        });
        arr.splice(index,1);
        storeInDb(arr);
}

app.get("/",(req,res)=>{
    res.sendFile(__dirname + '/loginpage.html');
})

app.post("/login",(req,res)=>{

    const email=req.body.email;
    const password=req.body.password;
    if(email!=null && password!=null){
        localStorage.setItem("userAvaliable",true);
        localStorage.setItem("totalUser",++totalUser)
        if(localStorage.getItem("userAvaliable")==true && localStorage.getItem("totalUser")>=2){
           console.log("You Can't Login Someone in present!!");
            
        }
        else{
           res.sendFile(__dirname + '/index.html');
        }
    }
    
})

app.get("/logout",(req,res)=>{
    localStorage.removeItem("userAvaliable");

    localStorage.removeItem("totalUser");

    res.sendFile(__dirname + '/loginpage.html');
})

// READ STUDENT DATABASE
app.get("/details",(req,res)=>{
    if(localStorage.getItem("userAvaliable")==true && localStorage.getItem("totalUser")>=2){
        console.log("You Can't Login Someone in present!!");
    }else{
        res.send(arr);
    }
})

app.get("/deleteStudent",(req,res)=>{
    if(localStorage.getItem("userAvaliable")==true && localStorage.getItem("totalUser")>=2){
        console.log("You Can't Login Someone in present!!");
    }else{
    res.sendFile(__dirname + '/removeStudent.html');
    }
})

app.post("/bykey",(req,res)=>{
    if(localStorage.getItem("userAvaliable")==true && localStorage.getItem("totalUser")>=2){
        console.log("You Can't Login Someone in present!!");
    }else{
    deleteKeyValue(req.body.id);
    res.sendFile(__dirname + '/index.html');
    }
})

app.post('/createStudent', function(req, res) {
    if(localStorage.getItem("userAvaliable")==true && localStorage.getItem("totalUser")>=2){
        console.log("You Can't Login Someone in present!!");
    }else{
    listener(true, createStudent(req.body.id,req.body.name,req.body.age,req.body.timeToLeave))
    res.sendFile(__dirname + '/index.html');
    console.log(arr)
    }
  });


app.listen(3000,()=>{
    console.log("Server started at port : 3000");
})