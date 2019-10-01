import * as React from 'react';
import * as d3 from 'd3';

// interface Props {

// }



const Doughnut: React.FC = () => {

    React.useEffect(()=>{
        const width = 540;
        const height = 540;
        const radius = Math.min(width, height) / 2;
    
        const svg = d3.select("#chart-area")
            .append("svg")
                .attr("width", width)
                .attr("height", height)
            .append("g")
                .attr("transform", `translate(${width / 2}, ${height / 2})`);
    
        const color = d3.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb",
             "#e78ac3","#a6d854","#ffd92f"]);
    
        const pie = d3.pie()
            .value((d:any) => d.count)
            .sort(null);
    
        const arc: any = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);
    
        // function type(d:any) {
        //     d.apples = Number(d.apples);
        //     d.oranges = Number(d.oranges);
        //     return d;
        // }
    
        function arcTween(this:any,a:any) {
            
            const i = d3.interpolate(this._current, a);
            this._current = i(1);
            return (t:any) => arc(i(t));
        }
      
const data :Record<string, {region:string; count:string;}[]>= {
	"apples": [
		{ "region": "North", "count": "53245"},
		{ "region": "South", "count": "28479"},
		{ "region": "East", "count": "19697"},
		{ "region": "West", "count": "24037"},
		{ "region": "Central", "count": "40245"}
	],
	"oranges": [
		{ "region": "North", "count": "200"},
		{ "region": "South", "count": "200"},
		{ "region": "East", "count": "200"},
		{ "region": "West", "count": "200"},
		{ "region": "Central", "count": "200"}
	]
};
        document.querySelector('#chart-area')!.innerHTML+=`<label><input type="radio" name="dataset" value="apples" checked/> Apples</label>
            <label><input type="radio" name="dataset" value="oranges"/> Oranges</label>`;
            document.querySelectorAll('input').forEach(cv=>cv.addEventListener("change", update));
            
            function update(this:{value?:string}= {}, val:string = this.value) {
                // Join new data
                const path = svg.selectAll("path")
                    .data(pie(data[val]));
    
                // Update existing arcs
                path.transition().duration(200).attrTween("d", arcTween);
    
                // Enter new arcs
                path.enter().append("path")
                    .attr("fill", (d, i) => color(i.toString()))
                    .attr("d", arc)
                    .attr("stroke", "white")
                    .attr("stroke-width", "6px")
                    .each((d)=> { this._current = d; });
            }
    
            update("apples");
    });
    
    return (
        <div id="chart-area">      
    </div>    
    );
};

export default Doughnut;