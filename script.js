document.addEventListener('DOMContentLoaded', () => {  

    // --- 模式一：手动计算 ---  
    document.getElementById('calculate-btn').addEventListener('click', function() {  
        const longitude = document.getElementById('longitude').value;  
        const latitude = document.getElementById('latitude').value;  
        const year = document.getElementById('year').value;  
        const resultBox = document.getElementById('urbansat-index');  

        if (!longitude || !latitude || !year) {  
            alert('请输入经度、纬度和年份！');  
            return;  
        }  
        
        if (isNaN(longitude) || isNaN(latitude) || isNaN(year)) {  
            alert('经度、纬度和年份都必须是有效的数字！');  
            return;  
        }  

        const calculatedIndex = calculateUrbansatIndex(longitude, latitude, year);  
        resultBox.value = calculatedIndex.toFixed(4);  
    });  

    // --- 模式二：文件处理 ---  
    const fileUpload = document.getElementById('file-upload');  
    const processFileBtn = document.getElementById('process-file-btn');  
    const fileInfo = document.getElementById('file-info'); // 这是显示文件名的span  
    let uploadedFile = null;  

    fileUpload.addEventListener('change', (event) => {  
        uploadedFile = event.target.files[0];  
        if (uploadedFile) {  
            // 更新：显示文件名到新的span中  
            fileInfo.textContent = uploadedFile.name;   
        } else {  
            fileInfo.textContent = '未选择文件';  
        }  
    });  

    processFileBtn.addEventListener('click', () => {  
        if (!uploadedFile) {  
            alert('请先选择一个XLSX文件！');  
            return;  
        }  

        const reader = new FileReader();  
        reader.onload = (e) => {  
            try {  
                const data = new Uint8Array(e.target.result);  
                const workbook = XLSX.read(data, { type: 'array' });  

                const firstSheetName = workbook.SheetNames[0];  
                const worksheet = workbook.Sheets[firstSheetName];  
                
                const json_data = XLSX.utils.sheet_to_json(worksheet);  

                if (json_data.length === 0) {  
                    alert('文件是空的或格式不正确！');  
                    return;  
                }  
                
                json_data.forEach(row => {  
                    const lon = row['Longitude'];  
                    const lat = row['Latitude'];  
                    const year = row['Year'];  
                    
                    if (lon !== undefined && lat !== undefined && year !== undefined && !isNaN(lon) && !isNaN(lat) && !isNaN(year)) {  
                        const index = calculateUrbansatIndex(lon, lat, year);  
                        row['Urbansat_Index'] = parseFloat(index.toFixed(4));  
                    } else {  
                        row['Urbansat_Index'] = 'Invalid Data';  
                    }  
                });  
                
                const new_worksheet = XLSX.utils.json_to_sheet(json_data);  
                
                const new_workbook = XLSX.utils.book_new();  
                XLSX.utils.book_append_sheet(new_workbook, new_worksheet, firstSheetName);  
                
                const newFileName = `urbansat_result_${uploadedFile.name}`;  
                XLSX.writeFile(new_workbook, newFileName);  
                
                alert(`处理完成！已开始下载 ${newFileName}`);  

            } catch (error) {  
                console.error("文件处理错误:", error);  
                alert("处理文件时发生错误。请确保文件是有效的XLSX格式，且包含 'Longitude', 'Latitude', 'Year' 列。");  
            }  
        };  
        
        reader.onerror = () => {  
            alert('读取文件时发生错误！');  
        };  

        reader.readAsArrayBuffer(uploadedFile);  
    });  

    /**  
     * Urbansat 指数核心计算逻辑  
     */  
    function calculateUrbansatIndex(longitude, latitude, year) {  
        console.log(`计算中: Lon=${longitude}, Lat=${latitude}, Year=${year}`);  
        const yearEffect = parseInt(year) - 2000;  
        return (parseFloat(longitude) + parseFloat(latitude) + yearEffect) * Math.random();  
    }  
});