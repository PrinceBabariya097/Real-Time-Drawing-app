import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import rough from "roughjs/bundled/rough.esm";

const generator = rough.generator();

export const Canvas = ({
  color,
  tool,
  user,
  socket,
  canvasRef,
  elements,
  setElements,
  brushWidth,
  roughness,
  filled,
}) => {
  const [img, setImg] = useState(null);
  const ctx = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedShapes, setSelectedShapes] = useState(null);

  const fileNum = Math.random() * 10000

  

  useEffect(() => {
    socket.on("whiteboardDataResponce", (data) => {
      setImg(data.imgURL);
    });
  }, []);

  if (!user?.presenter) {
    return (
      <div width={window.innerWidth} height={window.innerHeight}>
        <img src={img} alt="Real time Whiteboard image" />
      </div>
    );
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.strokeWidth = 1;
    context.lineCap = "round";
    context.strokeStyle = color;
    context.lineWidth = brushWidth;
    ctx.current = context;
  }, []);

  useEffect(() => {
    
  })

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawing(true);

    if (tool === "pencil") {
      setElements((prevElements) => [
        ...prevElements,
        {
          x1: offsetX,
          y1: offsetY,
          path: [[offsetX, offsetY]],
          stroke: color,
          element: tool,
          width: brushWidth,
          rough: roughness,
        },
      ]);
    } else if (tool === "arrow") {
      setElements((prevElements) => [
        ...prevElements,
        {
          x1: offsetX,
          y1: offsetY,
          x2: offsetX,
          y2: offsetY,
          stroke: color,
          element: tool,
          width: brushWidth,
          rough: roughness,
        },
      ]);
    } else if (tool === "text") {
      const roughCanvas = rough.canvas(canvasRef.current)
      const inputText = document.getElementById('inputText')
      inputText.style.left = offsetX + "px";
      inputText.style.top = offsetY + "px";
      inputText.style.display = "block";
      inputText.focus();
      const text = inputText.value
      inputText.value = ''
      setElements((prevElements) => [
        ...prevElements,
        {
          x1: offsetX,
          y1: offsetY,
          text:text,
          fontSize:'24px',
          stroke: color,
          element: tool,
          width: brushWidth,
          rough: roughness,
        },
      ]);
    } else {
      setElements((prevElements) => [
        ...prevElements,
        {
          x1: offsetX,
          y1: offsetY,
          stroke: color,
          element: tool,
          width: brushWidth,
          rough: roughness,
        },
      ]);
    }
  };

  const handelMovingMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const mouseX = offsetX;
    const mouseY = offsetY;
    if (tool === "move") {
      for (let i = elements.length - 1; i >= 0; i--) {
        const shape = elements[i];
        if (shape.element === "rect") {
          if (
            mouseX >= shape.x1 &&
            mouseX <= shape.x2 &&
            mouseY >= shape.y1 &&
            mouseY <= shape.y2
          ) {
            setSelectedShapes({
              shape,
              startX: mouseX - shape.x1,
              startY: mouseY - shape.y1,
              index: i,
            });
            break;
          }
        } else if (shape.element === "line") {
          if (
            mouseX >= shape.x1 - 5 &&
            mouseX <= shape.x2 + 5 &&
            mouseY >= shape.y1 - 5 &&
            mouseY <= shape.y2 + 5
          ) {
            setSelectedShapes({
              shape,
              startX: mouseX - shape.x1,
              startY: mouseY - shape.y1,
              index: i,
            });
            break;
          }
        } else if (shape.element === "oval") {
          const centerX = shape.x1 + shape.owidth / 2;
          const centerY = shape.y1 + shape.oheight / 2;
          if (
            (mouseX - centerX) ** 2 / (shape.owidth / 2) ** 2 +
              (mouseY - centerY) ** 2 / (shape.oheight / 2) ** 2 <=
            1
          ) {
            setSelectedShapes({
              shape,
              startX: mouseX - shape.x1,
              startY: mouseY - shape.y1,
              index: i,
            });
            break;
          }
        } else if (shape.element === "arrow") {
          if (
            mouseX >= shape.x1 &&
            mouseX <= shape.x2 &&
            mouseY >= shape.y1 &&
            mouseY <= shape.y2
          ) {
            setSelectedShapes({
              shape,
              startX: mouseX - shape.x1,
              startY: mouseY - shape.y1,
              index: i,
            });
            break;
          }
        }
      }
    }
  };

  useLayoutEffect(() => {
    const roughCanvas = rough.canvas(canvasRef.current);
    if (elements.length > 0) {
      ctx.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
    elements.forEach((ele, i) => {
      if (ele.element === "rect") {
        roughCanvas.draw(
          generator.rectangle(
            ele.x1,
            ele.y1,
            ele.x2 - ele.x1,
            ele.y2 - ele.y1,
            {
              stroke: ele.stroke,
              roughness: ele.rough,
              strokeWidth: ele.width,
            }
          )
        );
      } else if (ele.element === "line") {
        roughCanvas.draw(
          generator.line(ele.x1, ele.y1, ele.x2, ele.y2, {
            stroke: ele.stroke,
            roughness: ele.rough,
            strokeWidth: ele.width,
          })
        );
      } else if (ele.element === "pencil") {
        roughCanvas.linearPath(ele.path, {
          stroke: ele.stroke,
          roughness: ele.rough,
          strokeWidth: ele.width,
        });
        console.log(ele);
      } else if (ele.element === "oval") {
        const width = Math.abs(ele.x2 - ele.x1);
        const height = Math.abs(ele.y2 - ele.y1);
        const minX = Math.min(ele.x1, ele.x2);
        const minY = Math.min(ele.y1, ele.y2);

        roughCanvas.ellipse(
          minX + width / 2,
          minY + height / 2,
          width,
          height,
          {
            stroke: ele.stroke,
            roughness: ele.rough,
            strokeWidth: ele.width,
          }
        );
      } else if (ele.element === "arrow") {
        // Draw the arrow line
        roughCanvas.line(ele.x1, ele.y1, ele.x2, ele.y2, {
          stroke: ele.stroke,
          roughness: ele.rough,
          strokeWidth: ele.width,
        });

        // Draw arrowhead
        const arrowheadSize = 20;
        const angle = Math.atan2(ele.y2 - ele.y1, ele.x2 - ele.x1);
        roughCanvas.polygon(
          [
            [ele.x2, ele.y2],
            [
              ele.x2 - arrowheadSize * Math.cos(angle - Math.PI / 6),
              ele.y2 - arrowheadSize * Math.sin(angle - Math.PI / 6),
            ],
            [
              ele.x2 - arrowheadSize * Math.cos(angle + Math.PI / 6),
              ele.y2 - arrowheadSize * Math.sin(angle + Math.PI / 6),
            ],
          ],
          { stroke: ele.stroke, strokeWidth: ele.width, roughness: 0 }
        );
      } else if (ele.element === "text") {
        ctx.current.font = ele.fontSize
        ctx.current.strokeText(ele.text,ele.x1,ele.y1)
      }
    });

    const canvasImage = canvasRef.current.toDataURL();
    socket.emit("whiteboardData", canvasImage);
  }, [elements]);

  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "move" && selectedShapes) {
      const { shape, startX, startY } = selectedShapes;
      const newX1 = offsetX - startX;
      const newY1 = offsetY - startY;

      if (shape.element === "rect") {
        setElements((prev) => {
          const updatedElementes = [...prev];
          updatedElementes[selectedShapes.index] = {
            ...shape,
            x1: newX1,
            y1: newY1,
            x2: newX1 + (shape.x2 - shape.x1),
            y2: newY1 + (shape.y2 - shape.y1),
          };
          return updatedElementes;
        });
      } else if (shape.element === "line") {
        setElements((prev) => {
          const updatedElementes = [...prev];
          updatedElementes[selectedShapes.index] = {
            ...shape,
            x1: newX1,
            y1: newY1,
            x2: newX1 + (shape.x2 - shape.x1),
            y2: newY1 + (shape.y2 - shape.y1),
          };
          return updatedElementes;
        });
      } else if (shape.element === "oval") {
        const centerX = shape.x1 + shape.owidth / 2;
        const centerY = shape.y1 + shape.oheight / 2;
        const newcenterX = newX1 + shape.owidth / 2;
        const newcenterY = newY1 + shape.oheight / 2;
        const dx = newcenterX - centerX;
        const dy = newcenterY - centerY;

        setElements((prev) => {
          const updatedElementes = [...prev];
          updatedElementes[selectedShapes.index] = {
            ...shape,
            x1: newX1,
            y1: newY1,
            x2: shape.x2 + dx,
            y2: shape.y2 + dy,
          };
          return updatedElementes;
        });
      } else if (shape.element === "arrow") {
        setElements((prev) => {
          const updatedElementes = [...prev];
          updatedElementes[selectedShapes.index] = {
            ...shape,
            x1: newX1,
            y1: newY1,
            x2: newX1 + (shape.x2 - shape.x1),
            y2: newY1 + (shape.y2 - shape.y1),
          };
          return updatedElementes;
        });
      }
    } else if (tool === "rect" && isDrawing) {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
                x1: ele.x1,
                y1: ele.y1,
                x2: offsetX,
                y2: offsetY,
                stroke: ele.stroke,
                element: ele.element,
                width: ele.width,
                rough: ele.rough,
              }
            : ele
        )
      );
    } else if (tool === "line" && isDrawing) {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
                x1: ele.x1,
                y1: ele.y1,
                x2: offsetX,
                y2: offsetY,
                stroke: ele.stroke,
                element: ele.element,
                width: ele.width,
                rough: ele.rough,
              }
            : ele
        )
      );
    } else if (tool === "pencil" && isDrawing) {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
                x1: ele.x1,
                y1: ele.y1,
                path: [...ele.path, [offsetX, offsetY]],
                stroke: ele.stroke,
                element: ele.element,
                width: ele.width,
                rough: ele.rough,
              }
            : ele
        )
      );
    } else if (tool === "oval" && isDrawing) {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
                x1: ele.x1,
                y1: ele.y1,
                x2: offsetX,
                y2: offsetY,
                owidth: Math.abs(offsetX - ele.x1),
                oheight: Math.abs(offsetY - ele.y1),
                stroke: ele.stroke,
                element: ele.element,
                width: ele.width,
                rough: ele.rough,
              }
            : ele
        )
      );
    } else if (tool === "arrow" && isDrawing) {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
                x1: ele.x1,
                y1: ele.y1,
                x2: offsetX,
                y2: offsetY,
                stroke: ele.stroke,
                element: ele.element,
                width: ele.width,
                rough: ele.rough,
              }
            : ele
        )
      );
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setSelectedShapes(null);
    inputText.style.display = "none";

  };

  const handelContextMenu = () => {
    const inputText = document.getElementById('inputText')
    inputText.style.display = "none";
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        id="canvas"
        onMouseDown={tool === "move" ? handelMovingMouseDown : handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={handelContextMenu}
        style={{
          cursor:
            'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMjBweCcgaGVpZ2h0PScyNnB4JyB0cmFuc2Zvcm0gPSAncm90YXRlKDgwKScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB2aWV3Qm94PScwIDAgNTEyIDUxMic+PHBhdGggZD0nTTQxMC4zIDIzMWwxMS4zLTExLjMtMzMuOS0zMy45LTYyLjEtNjIuMUwyOTEuNyA4OS44bC0xMS4zIDExLjMtMjIuNiAyMi42TDU4LjYgMzIyLjljLTEwLjQgMTAuNC0xOCAyMy4zLTIyLjIgMzcuNEwxIDQ4MC43Yy0yLjUgOC40LS4yIDE3LjUgNi4xIDIzLjdzMTUuMyA4LjUgMjMuNyA2LjFsMTIwLjMtMzUuNGMxNC4xLTQuMiAyNy0xMS44IDM3LjQtMjIuMkwzODcuNyAyNTMuNyA0MTAuMyAyMzF6TTE2MCAzOTkuNGwtOS4xIDIyLjdjLTQgMy4xLTguNSA1LjQtMTMuMyA2LjlMNTkuNCA0NTJsMjMtNzguMWMxLjQtNC45IDMuOC05LjQgNi45LTEzLjNsMjIuNy05LjF2MzJjMCA4LjggNy4yIDE2IDE2IDE2aDMyek0zNjIuNyAxOC43TDM0OC4zIDMzLjIgMzI1LjcgNTUuOCAzMTQuMyA2Ny4xbDMzLjkgMzMuOSA2Mi4xIDYyLjEgMzMuOSAzMy45IDExLjMtMTEuMyAyMi42LTIyLjYgMTQuNS0xNC41YzI1LTI1IDI1LTY1LjUgMC05MC41TDQ1My4zIDE4LjdjLTI1LTI1LTY1LjUtMjUtOTAuNSAwem0tNDcuNCAxNjhsLTE0NCAxNDRjLTYuMiA2LjItMTYuNCA2LjItMjIuNiAwcy02LjItMTYuNCAwLTIyLjZsMTQ0LTE0NGM2LjItNi4yIDE2LjQtNi4yIDIyLjYgMHM2LjIgMTYuNCAwIDIyLjZ6Jy8+PC9zdmc+"), auto',
        }}
      />
      <textarea id="inputText" className="z-[1] absolute bg-transparent" style={{display:'none'}}/>
    </>
  );
};


export  function downloadCanvasAsImage() {
  var canvas = document.getElementById('canvas');
  
  var downloadLink = document.createElement('a');
  
  downloadLink.download = `${fileNum}`;
  
  downloadLink.href = canvas.toDataURL('image/png');
  
  downloadLink.click();
}
