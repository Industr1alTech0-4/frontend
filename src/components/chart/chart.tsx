import { Chart } from "react-google-charts";

export function chart(name: string, data_: any) {
    console.log(data_)
    
    const dataInData: (string | number)[][] = [
        ["Строка", "Значение"]  
    ];
    
    for (let i = 0; i < data_.length; i++) {
        dataInData.push([
            data_[i].row,      
            Number(data_[i].value) 
        ]);
    }
    
    return (
        <Chart
            // Try different chart types by changing this property with one of: LineChart, BarChart, AreaChart...
            chartType="AreaChart"
            data={dataInData}  
            options={{
                title: name,
                // hAxis: { title: "Номер строки",  },
                // vAxis: { minValue: 0, title: "Значение" , titleTextStyle: { color: "#ff5e5e" }},
            }}
            legendToggle
        />
    );
}