export const onExit = (callback: (done: ()=>void)=>void) => {
    let runOnce = false;

    process.on("exit", ()=>{
        if (!runOnce) {
            runOnce = true;
            callback(()=>process.exit(0));
        }
    });

    process.on("SIGINT", ()=>{
        if (!runOnce) {
            runOnce = true;
            callback(()=>process.exit(2));
        }
    });

    // process.on("uncaughtException", (e)=>{
    //     console.log("Uncaught Exception: ", e.stack);
    //     callback();
    // });
}