const Express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

const serviceAccount = require("./firebase.json");
const { getMessaging } = require("firebase-admin/messaging");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const app = new Express();
const router = Express.Router();

app.use(Express.json());
app.use(bodyParser.json());
app.use("/", router);

app.listen(3000, () => {
    console.log(`Server started on port 3000`);
});

router.get("/test",(req,res)=>{
    res.status(200).json({ message: "its working" });
})

router.post("/register", (req, res) => {
    console.log(req.body, "Register")
    if (req.body.type == "pro") {
        pro_tokens = req.body.token
    } else {
        normal_token = req.body.token
    }
    res.status(200).json({ message: "Successfully registered FCM Token!" });
});

router.post("/notifications", async (req, res) => {
    try {
        console.log(req.body)
        // Send a message to the 'news' topic
        const message_subscribe = {
            notification: {
                title: 'Ringing...',
                body: `${req.body.name} is calling you.`,
            },
            data: {
                callingStatus: req.body.callingStatus, 
                name: req.body.name,
                id: req.body.id,
                callerId: req.body.callerId
            },
            topic: req.body.id.toString(),  // The topic to send the notification to
        };
        // const message = {
        //     data: {
        //         isCall: "true",
        //         data: req.body.data
        //     },
        //     notification: {
        //         title: "this is test",
        //         body: "this is body",
        //     },
        //     token: req.body.token 
        // };
        getMessaging().send(message_subscribe)
            .then((response) => {
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                console.log('Error sending message:', error);
            });
        res.status(200).json({ message: "Successfully sent notifications!" });
    } catch (err) {
        res
            .status(err.status || 500)
            .json({ message: err.message || "Something went wrong!" });
    }
});

/**
 * 1 for calling
 * 2 for pick
 * 3 for decline
 * 4 getting call
 * 5 for on call
 */