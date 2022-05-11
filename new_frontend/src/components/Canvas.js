
import React, { useRef, useEffect, useState } from 'react'

const Canvas = (props) => {
    const canvasRef = useRef(null)
    const [largestIndex, setLargestIndex] = useState(0);
    const [windowWidth, setWindowWidth] = useState(100);
    const [windowHeight, setWindowHeight] = useState(100);
    let canvas, ctx;

    useEffect(() => {
        canvas = canvasRef.current
        ctx = canvas.getContext('2d')
        initCanvas()

        setWindowWidth(window.innerWidth)
        setWindowHeight(window.innerHeight)
    }, [])

    // useEffect(() => {
    //     setInterval(() => {
    //         fetch("http://localhost:6923/largest").then(response => {
    //             return response.text();
    //         }).then(largestIndex => {
    //             setLargestIndex(largestIndex);
    //         }).catch(err => {
    //             console.log(err);
    //         });
    //     }, 100);
    // }, []);

    let canvasOffset, offsetX, offsetY, canvasx, canvasy;
    let startX, startY;

    let isDrawing = false, mousedown = false;
    let last_mousex = 0, last_mousey = 0, mousex = 0, mousey = 0;

    const initCanvas = () => {
        if (!canvasRef.current) { return }
        canvasOffset = canvasRef.current.offset;
        offsetX = canvasRef.current.offsetLeft;
        offsetY = canvasRef.current.offsetTop;
        canvasx = canvasRef.current.offsetLeft;
        canvasy = canvasRef.current.offsetTop;
        drawBackgroundImage();
    }

    const drawBackgroundImage = () => {
        // if (!canvasRef.current) { return }
        return new Promise((resolve, reject) => {
            const image = new Image();
            // image.src = 'https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8d2FsbCUyMGJhY2tncm91bmR8ZW58MHx8MHx8&w=1000&q=80';
            image.src = 'http://51.222.12.76:4000/0.jpg';
            image.onload = () => {
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                resolve();
            }
        })
    }

    //Mousedown
    const onMouseDownHandler = (e) => {
        last_mousex = parseInt(e.clientX - canvasx);
        last_mousey = parseInt(e.clientY - canvasy);
        mousedown = true;
    };

    //Mouseup
    const onMouseUpHandler = () => {
        mousedown = false;
        canvas.style.cursor = "default";

        drawBackgroundImage();
    }

    //Mousemove
    const onMouseMoveHandler = (e) => {
        mousex = parseInt(e.clientX - canvasx);
        mousey = parseInt(e.clientY - canvasy);
        if (mousedown) {
            drawBackgroundImage().then(() => {
                ctx.beginPath();
                var width = mousex - last_mousex;
                var height = mousey - last_mousey;
                ctx.rect(last_mousex, last_mousey, width, height);
                //ctx.fillStyle = "#8ED6FF";
                ctx.fillStyle = 'rgba(164, 221, 249, 0.3)'
                ctx.fill();
                ctx.strokeStyle = '#1B9AFF';
                ctx.lineWidth = 1;
                ctx.rect(last_mousex, last_mousey, width, height)
                ctx.stroke();
            })
        }
        //Output
        // document.getElementById('output').innerHTML = `Current: ${mousex}, ${mousey}<br/>Last: ${last_mousex}, ${last_mousey}<br/>Drawing: ${mousedown}`;
    }

    const handleMouseDown = (e) => {
        mousex = parseInt(e.clientX - offsetX);
        mousey = parseInt(e.clientY - offsetY);

        startX = mousex;
        startY = mousey;
        canvas.style.cursor = "crosshair";

        // drawBackgroundImage();

    }

    return <>
        <canvas
            width="802px" // {windowWidth} // default is 1069px
            height="535px" // {windowHeight} // default is 713px
            
            ref={canvasRef}
            onMouseDown={(e) => {
                onMouseDownHandler(e);
                handleMouseDown(e);
            }}
            onMouseUp={onMouseUpHandler}
            onMouseMove={onMouseMoveHandler}
            {...props} />
        <div id="output"></div>
        <div id="downlog"></div>
    </>
}

export default Canvas