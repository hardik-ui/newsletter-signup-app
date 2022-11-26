const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const data = {
        members: [
            {
                email_address: req.body.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: req.body.fname,
                    LNAME: req.body.lname,
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/0b9054d14e"
    const options = {
        method: "POST",
        auth: "hgupta:295b56c5173f70af0e808ed234f863b3-us21"
    }
    const request = https.request(url, options, function(response){
        console.log(response.statusCode);

        // if(response.statusCode==200){
        //     res.sendFile(__dirname+"/success.html");
        // } else{
        //     res.sendFile(__dirname+"/failure.html");
        // }
        response.on("data", function(data){
            console.log(JSON.parse(data));
            const retData = JSON.parse(data);
            if(retData.errors.length>0){
                res.sendFile(__dirname+"/failure.html");
            } else{
                res.sendFile(__dirname+"/success.html");
            }
        });
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

// 295b56c5173f70af0e808ed234f863b3-us21
//0b9054d14e
app.listen(process.env.PORT || 3000, function(){
    console.log("Server started at port 3000");
});
