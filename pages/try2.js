import React, { useState, useEffect } from 'react';


const TryState = props => {
 const [arrayObjects, setArrayObjects] = useState([
    {
      type: 'folder',
      name: 'name 1',
      id: '1',
      files: [
        {
          type: 'folder',
          name: 'name 1',
          id: '2',
          files: [
            { type: 'file', name: 'JSFile.js', id: '3' },
          ],
        },
      ],
    },
    {
        type: 'folder',
        name: 'name 2 ',
        id: '6',
        files: [
            { type: 'file', name: 'File.js', id: '7' },
            { type: 'file', name: 'JSXfile.jsx', id: '14' },
            {
            type: 'folder',
            name: 'name 1',
            id: '6',
            files: [
                { type: 'file', name: 'HTMLfile.html', id: '5' },
            ],
            },
        ],
    }
  ])
 const [initialLoad, setInitialLoad] = useState(true)
 useEffect(()=> {
   if (initialLoad) {
    console.log('initialLoad', arrayObjects)
    setInitialLoad(false)
   }
 }, [initialLoad])
 return (
    <div>
        test
        <div>
            length { arrayObjects?.length }
            <div
            onClick={() => {
                setArrayObjects(arrayObjects => {
                    const oldObject = arrayObjects.find(item => item.name === 'name 1')
                    const oldObjectIndex = arrayObjects.findIndex(item => item.name === 'name 1')
                    const newFile = {
                        type: 'file',
                        name: 'SXfile',
                        id: "100",
                      }
                    console.log('oldObject', oldObject)
                    const files = [
                        ...oldObject.files,
                        newFile
                    ]
                    const updatedObject = {
                        ...oldObject,
                        files
                    }
                    arrayObjects.splice(oldObjectIndex, 1, updatedObject)
                })
                console.log('updated', arrayObjects)
            }}>
                update object
            </div>
            {
                arrayObjects?.length > 0 
                ?   <>
                        {
                            arrayObjects?.map((item, i) => 
                                <div key={i}>
                                    {item.type}
                                    <div>
                                        {
                                            item.files?.map ((file, i) => 
                                                <div>
                                                    {file.name}
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            )
                        }
                    </>
                :   <>
                        not enough
                    </>
            }
        </div>
    </div>
 )

}

export default TryState