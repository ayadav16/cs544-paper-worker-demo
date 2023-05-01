self.onmessage = (e) => {
    const n = Number(e.data);
    generateXY(n);
};

function isSame(p1, p2){
    return p1[0]==p2[0] && p1[1]==p2[1];
}

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
    self.postMessage(points);
}
  