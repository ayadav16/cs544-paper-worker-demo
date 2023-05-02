self.onmessage = (e) => {
    const n = Number(e.data);
    generateX(n);
};

// generate point x
// ensures that we do not get
// many duplicated points. it is an 
// attempt to simulate complex 
// calculations.
function generateX(num) {
    let points = [];
    let i = 0;
    while(i<num){
        const x = Math.floor(Math.random() * num/10);
        if(points.filter(e=>e==x).length<=100){
            points.push(x)
            i++;
        }
    }
    // sending back the message to main thread
    self.postMessage(points);
}
  