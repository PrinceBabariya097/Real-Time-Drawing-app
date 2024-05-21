import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'

function UpperNavBar({brushWidth, setBrushWidth, roughness, setRoughness, downloadCanvasAsImage, filleType, setFillType  }) {
  return (
    <div className=" w-full absolute top-3 flex justify-center">
          <div className="flex w-fit bg-[#A2A2A1FF] p-2 rounded-xl">
            <div className="flex flex-col text-center">
              Brush Width
              <input
                type="range"
                min={1}
                max={5}
                value={brushWidth}
                onChange={(e) => setBrushWidth(e.target.value)}
                list="markers"
              />
              <datalist id="markers">
                <option value="1"></option>
                <option value="2"></option>
                <option value="3"></option>
                <option value="4"></option>
                <option value="5"></option>
              </datalist>
            </div>
            <div className="flex flex-col text-center mx-4">
              Brush Roughness
              <input
                type="range"
                min={0}
                max={3}
                step={0.5}
                value={roughness}
                onChange={(e) => setRoughness(e.target.value)}
                list="markers2"
              />
              <datalist id="markers2">
                <option value="0"></option>
                <option value="0.5"></option>
                <option value="1"></option>
                <option value="1.5"></option>
                <option value="2"></option>
                <option value="2.5"></option>
                <option value="3"></option>
              </datalist>
            </div>
            <div className="flex flex-col text-center mx-4">
              <FontAwesomeIcon icon={faDownload} onClick={downloadCanvasAsImage} id='download' name='download'/>
              <label htmlFor="Download"></label>
            </div>
            <div className="flex flex-col text-center mx-4">
                <label htmlFor="filled">Filled Type</label>
              <select name="filled" id="filled" onChange={(e) => setFillType(e.target.value)}>
              <option value="none">No Fill</option>
              <option value="solid">Solid</option>
              </select>
            </div>
          </div>
        </div>
  )
}

export default UpperNavBar