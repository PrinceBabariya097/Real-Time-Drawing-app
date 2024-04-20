import { useEffect, useRef, useState } from "react"

export function drawPancel(){
    const canvasRef = useRef(null)
    const ctxRef  = useRef()
    const [isDrawing, setIsDrawing] = useState(false)
    
    
        
        function  onMouseDown(nativeEvent){
            setIsDrawing(true)
        if(!canvasRef.current){
            return
        }
            const ctx  = canvasRef.current.getContext('2d')
            ctxRef.current = ctx
            const {offsetX,offsetY} = nativeEvent
            ctxRef.current.beginPath()
            ctxRef.current.moveTo(offsetX,offsetY)
            ctxRef.current.lineTo(offsetX,offsetY)
            ctxRef.current.stroke()
            nativeEvent.preventDefault()
        } 
        if(canvasRef.current)  canvasRef.current.addEventListener('mousedown',(e) => onMouseDown(e))
        
        
        function onMouseMove(nativeEvent){
            if(!isDrawing){
                return
            }
            const ctx  = canvasRef.current.getContext('2d')
            ctxRef.current = ctx
            const  {offsetX, offsetY} = nativeEvent
            ctxRef.current.lineTo(offsetX,offsetY)
            ctxRef.current.stroke();
            nativeEvent.preventDefault()
        }
        if(canvasRef.current) canvasRef.current.addEventListener('mousemove',(e) => onMouseMove(e))
        
        function endDraw(){
            ctxRef.current.closePath()
            setIsDrawing(false)
        }
        if(canvasRef.current) canvasRef.current.addEventListener('mouseup', endDraw)
    
    return{
        canvasRef
    }
}