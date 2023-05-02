self.onmessage = (e) => {
    const n = Number(e.data);
    generateXY(n);
};


//  checks if two points are same
function isSame(p1, p2){
    return p1[0]===p2[0] && p1[1]===p2[1];
}

// generate points x and y 
// ensures that each point 
// is unique. it is an 
// attempt to simulate complex 
// calculations.
function generateXY(num) {
    let points = [];
    let i = 0;
    while(i<num){
        const x = Math.floor(Math.random() * num/3);
        const y = Math.floor(Math.random() * num/3);
        if(points.findIndex(e=>isSame(e,[x,y]))==-1){
            points.push([x,y])
            i++;
        }
    }
    // sending back the message to main thread
    self.postMessage(points);
}
  