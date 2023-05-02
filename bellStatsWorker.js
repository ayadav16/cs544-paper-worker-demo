self.onmessage = (e) => {
    const arr = e.data;
    const mean = getMean(arr);
    const std = getStd(arr, mean);
    // sending back the message to main thread
    self.postMessage([mean, std]);
};



function getMean(arr) {
    let s = 0;
    let n = arr.length;

    for(const v of arr){
        s += Number(v);
    }
    return s/n;
}

function getStd(arr, mean){
    let s=0;
    let n=arr.length;
    for(const v of arr){
        s += Math.pow(+v - mean, 2);
    }
    return s/n;
}
  
