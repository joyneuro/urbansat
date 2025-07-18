document.addEventListener('DOMContentLoaded', () => {  

    // --- 模式一：手动计算 ---  
    document.getElementById('calculate-btn').addEventListener('click', function() {  
        const longitude = document.getElementById('longitude').value;  
        const latitude = document.getElementById('latitude').value;  
        const resultBox = document.getElementById('urbansat-index');  

        if (!longitude || !latitude) {  
            alert('请输入经度和纬度！');  
            return;  
        }  
        
        if (isNaN(longitude) || isNaN(latitude)) {  
            alert('经纬度必须是有效的数字！');  
            return;  
        }  

        // 调用核心计算函数  
        const calculatedIndex = calculateUrbansatIndex(longitude, latitude);  
        resultBox.value = calculatedIndex.toFixed(4);  
    });  

    // --- 模式二：文件处理 ---  
    const fileUpload = document.getElementById('file-upload');  
    const processFileBtn = document.getElementById('process-file-btn');  
    const fileInfo = document.getElementById('file-info');  
    let uploadedFile = null;  

    fileUpload.addEventListener('change', (event) => {  
        uploadedFile = event.target.files[0];  
        if (uploadedFile) {  
            fileInfo.textContent = `已选择文件: ${uploadedFile.name}`;  
        } else {  
            fileInfo.textContent = '';  
        }  
    });  

    processFileBtn.addEventListener('click', () => {  
        if (!uploadedFile) {  
            alert('请先选择一个XLSX文件！');  
            return;  
        }  

        const reader = new FileReader();  
        reader.onload = (e) => {  
            const data = new Uint8Array(e.target.result);  
            const workbook = XLSX.read(data, { type: 'array' });  

            const firstSheetName = workbook.SheetNames[0];  
            const worksheet = workbook.Sheets[firstSheetName];  
            
            // 将工作表转换为JSON对象数组  
            const json_data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });  

            if (json_data.length < 2) {  
                alert('文件是空的或没有数据行！');  
                return;  
            }  
            
            // 添加新列的表头  
            const header = json_data[0];  
            header.push('Urbansat_Index');  

            // 从第二行开始处理数据  
            for (let i = 1; i < json_data.length; i++) {  
                const row = json_data[i];  
                const lon = row[0]; // 假设经度在第一列  
                const lat = row[1]; // 假设纬度在第二列  
                
                if (lon !== undefined && lat !== undefined && !isNaN(lon) && !isNaN(lat)) {  
                    const index = calculateUrbansatIndex(lon, lat);  
                    row.push(index.toFixed(4)); // 添加计算结果到行末  
                } else {  
                    row.push('Invalid Data'); // 如果数据无效，则标记  
                }  
            }  
            
            // 将更新后的JSON数据转换回工作表  
            const new_worksheet = XLSX.utils.aoa_to_sheet(json_data);  
            
            // 创建一个新的工作簿并附加工作表  
            const new_workbook = XLSX.utils.book_new();  
            XLSX.utils.book_append_sheet(new_workbook, new_worksheet, firstSheetName);  
            
            // 生成并下载新的Excel文件  
            const newFileName = `urbansat_${uploadedFile.name}`;  
            XLSX.writeFile(new_workbook, newFileName);  
            
            alert(`处理完成！已开始下载 ${newFileName}`);  
        };  
        
        reader.onerror = () => {  
            alert('读取文件时发生错误！');  
        };  

        reader.readAsArrayBuffer(uploadedFile);  
    });  

    /**  
     * Urbansat 指数核心计算逻辑  
     * @param {number | string} longitude - 经度  
     * @param {number | string} latitude - 纬度  
     * @returns {number} - 计算出的指数  
     */  
    function calculateUrbansatIndex(longitude, latitude) {  
        // --- 核心计算逻辑 ---  
        // 这里是你的真实算法。  
        // 这个例子只是简单地将经纬度相加然后取一个随机数。  
        // 你需要用你自己的真实算法替换这部分。  
        return (parseFloat(longitude) + parseFloat(latitude)) * Math.random();  
    }  
});