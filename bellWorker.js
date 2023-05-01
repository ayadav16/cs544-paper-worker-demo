self.onmessage = (e) => {
    const n = Number(e.data);
    generateX(n);
};

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
    self.postMessage(points);
}
  