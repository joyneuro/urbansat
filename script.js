document.getElementById('calculate-btn').addEventListener('click', function() {  
    const longitude = document.getElementById('longitude').value;  
    const latitude = document.getElementById('latitude').value;  
    const resultBox = document.getElementById('urbansat-index');  

    // 检查输入是否为空  
    if (!longitude || !latitude) {  
        alert('请输入经度和纬度！');  
        return;  
    }  
    
    // 检查输入是否为有效数字  
    if (isNaN(longitude) || isNaN(latitude)) {  
        alert('经纬度必须是有效的数字！');  
        return;  
    }  

    // --- 核心计算逻辑 ---  
    // 这里是一个示例计算。  
    // 你需要用你自己的真实算法替换这部分。  
    // 这个例子只是简单地将经纬度相加然后取一个随机数。  
    const calculatedIndex = (parseFloat(longitude) + parseFloat(latitude)) * Math.random();  
    
    // 将计算结果显示在结果框中，保留4位小数  
    resultBox.value = calculatedIndex.toFixed(4);  
});
