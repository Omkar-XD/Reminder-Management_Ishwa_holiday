const mongoose = require('mongoose');

async function test() {
  const uri = "mongodb+srv://rashidali18november:ishwa123@cluster0.gjvxn4w.mongodb.net/?appName=Cluster0";
  console.log('Testing URI...');
  try {
    await mongoose.connect(uri);
    console.log('CONNECTION SUCCESSFUL');
    process.exit(0);
  } catch (err) {
    console.error('CONNECTION FAILED:', err);
    process.exit(1);
  }
}

test();
