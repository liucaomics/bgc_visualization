import plotly
import plotly.graph_objects as go
import pandas as pd
import numpy as np
import sys

def gene2coordinates(start, end, width=10):
    '''
    convert gene start and end position into coordinates in figure.
    '''
    x = []
    y = []
    triangle_width = 100
    if start < end:
        length = end - start
        if length >= triangle_width:
            x = [end,end-triangle_width,start,start,end-triangle_width,end]
            y = [0,width/2,width/2,-width/2,-width/2,0]
        else:
            x = [end,start,start,end]
            y = [0,width/2,-width/2,0]
    else:
        length = start - end
        if length >= triangle_width:
            x = [end,end+triangle_width,start,start,end+triangle_width,end]
            y = [0,width/2,width/2,-width/2,-width/2,0]
        else:
            x = [end,start,start,end]
            y = [0,width/2,-width/2,0]
    return (x,y)

def draw_BGC(df_BGC,outfile,length_BGC=None):
    '''
    df_BGC is a pandas data frame with columns 
    start
    end
    '''
    if length_BGC is None:
        length_BGC = np.max( [np.max(df_BGC['start']),np.max(df_BGC['end'])] ) + 100
    fig = go.Figure()
    fig.add_hline(y=0,line_color='rgba(0,0,0,1)')
    for index, row in df_BGC.iterrows():
        x, y = gene2coordinates(row['start'],row['end'])
        fig.add_trace( go.Scatter(x=x, y=y, line_color='black',fill="toself", mode='lines') )
    fig.update_layout(showlegend=False,
        xaxis={'showgrid': False, 'range':[0, length_BGC],'tickfont':dict({'size':30})},
        yaxis={'showgrid': False, 'showticklabels': False},
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)'
    )
    fig.show()
    width = length_BGC/10
    print(width)
    height = 250 
    plotly.io.write_image(fig=fig,file=outfile,engine="orca",width=width,height=height)

if __name__ == "__main__":
    df = pd.read_csv(sys.argv[1])
    draw_BGC(df_BGC=df,outfile=sys.argv[2])



