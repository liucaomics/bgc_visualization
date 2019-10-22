var width = 0, height = 50, midline = height / 2, maxCoordinate=0, minCoordinate=0;

getMax("data/BASys_anno_GCA_000195815.1.csv",drawSVG)
//getMax("data/table_PSM-y-WR.csv",drawSVG)
//getMax("data/table_compoundx.csv",drawSVG)
//getMax("data/table_compoundy.csv",drawSVG)
//getMax("data/table_compoundz.csv",drawSVG)
//getMax("data/table_cyanobactinx_table.csv",drawSVG)
//getMax("data/table_informatinb.csv",drawSVG)
//getMax("data/table_PSM-2147-new.csv",drawSVG)
//getMax("data/table_PSM-y-WK.csv",drawSVG)
//getMax("data/table_wewakazole_table.csv",drawSVG)
//getMax("data/table_wewakazole_bgc.csv",drawSVG)
//getMax("data/table_PSM-y-WR.csv",drawSVG)
//getMax("data/table_PSM-beta.csv",drawSVG)
//getMax("data/table_delta-toxin.csv",drawSVG)
//getMax("data/table_AIP-III.csv",drawSVG)
//getMax("data/table_Mec-PSM.csv",drawSVG)
//getMax("data/table_polythenoamide.csv",drawSVG)
//getMax("data/table_Mec-PSM.csv",drawSVG)
//getMax("data/table_PSM-y.csv",drawSVG)

// functions 
function getMax(filepath,buildSVG){
    d3.csv(filepath, 
        function(d){
            return [+d.Start, +d.End]
        }, 
        function(data){
            console.log(...data)
            maxCoordinate = Math.max( ...data.map(function(d){return Math.max(...d)}) );
            minCoordinate = Math.min( ...data.map(function(d){return Math.min(...d)}) )
            console.log("min");
            console.log(minCoordinate);
            console.log("max");
            console.log(maxCoordinate);
            console.log("finish getMax");
            buildSVG(minCoordinate, maxCoordinate,filepath);
        }
    );
}

function drawSVG(minCoord, maxCoord, filepath){
    // initialization
    width = (maxCoord-minCoord)/30 + 40
    var scaleX = d3.scaleLinear().domain([minCoord,maxCoord]).range([20,width-20]);
    var scaleY = d3.scaleLinear().domain([0,height]).range([height,0]);
    var svgContainer = d3.select("body").append("svg").attr("width",width).attr("height",height);
    // draw lines
    svgContainer.append("line").attr("x1",0).attr("y1",midline).attr("x2",width).attr("y2",midline);
    // draw gene blocks
    d3.csv(filepath, function(d){
        return {
            start: +d.Start,
            end: +d.End,
            id: d.Accession +"|" + d.COG + "|" + d.Protein,
            index: d.index
        };
    }, function(data){
        console.log(data);
        svgContainer.selectAll("polygon").data(data).enter().append("polygon").attr("id", function(d){ console.log(d.id); return d.id;}).attr("points",function(d){
            var listPoint=[];
            if( d.start < d.end ){
               listPoint = forwardBlock(d.start,d.end,scaleX);
            }
            else{
                listPoint = backwardBlock(d.end,d.start,scaleX);
            }
            //console.log(listPoint)
            return listPoint.map(function(d){
                return d.join(",")}).join(" ");
        });
        svgContainer.selectAll("text").data(data).enter().append("text")
        .attr("x", function(d){ return Math.min(scaleX(d.start),scaleX(d.end)); } )
        .attr("y", 100)
        .attr("font-size","20px")
        .attr("text-anchor","middle")
        .attr("fill","black")
        .text(function(d){return d.index});

    });
}

function forwardBlock(left,right,scaleX){
    var listPoint=[];
    var threshold = 10;
    var svgLeft = scaleX(left), svgRight = scaleX(right), svgTop = midline+height/4, svgBottom = midline-height/4, svgMid=midline; 
    // if block is too short, then triangle
    // else polygon
    if( svgRight-svgLeft <= threshold ){
        listPoint.push([svgLeft, svgTop]);
        listPoint.push([svgRight, svgMid]);
        listPoint.push([svgLeft, svgBottom]);
    }
    else{
        listPoint.push([svgLeft,svgTop]);
        listPoint.push([svgRight-threshold,svgTop]);
        listPoint.push([svgRight,svgMid]);
        listPoint.push([svgRight-threshold,svgBottom]);
        listPoint.push([svgLeft,svgBottom]);
    }
    return listPoint;
}

function backwardBlock(left,right,scaleX){
    var listPoint=[];
    var threshold = 10;
    var svgLeft = scaleX(left), svgRight = scaleX(right), svgTop = midline+height/4, svgBottom = midline-height/4, svgMid=midline; 
    // if block is too short, then triangle
    // else polygon
    if( svgRight-svgLeft <= threshold ){
        listPoint.push([svgLeft, svgMid]);
        listPoint.push([svgRight, svgTop]);
        listPoint.push([svgRight, svgBottom]);
    }
    else{
        listPoint.push([svgLeft,svgMid]);
        listPoint.push([svgLeft+threshold,svgTop]);
        listPoint.push([svgRight,svgTop]);
        listPoint.push([svgRight,svgBottom]);
        listPoint.push([svgLeft+threshold,svgBottom]);
    }
    return listPoint;
}




