import mongoose from "mongoose";

const connectDb = async () => {
    // remember where ever use async there use try Catch
try {
    const connectDb = mongoose.connect(process.env.MongoDb || '');
    console.log('MongoDb Connected')
} catch (error) {
    console.error(`Error: ${error as Error}.message`)
    process.exit(1) // this will stop the app , if Db fails 
}


};


export default connectDb;