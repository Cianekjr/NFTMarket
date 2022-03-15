import { useState, DragEvent, ChangeEvent } from "react"

import { Input, Button, Card, Paper, Typography } from "@mui/material"
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material"
import { visuallyHidden } from "@mui/utils"

interface Props {
  handleImageChange: (file: File) => void
  isError: boolean
}

export const CreatorFileInput = (props: Props) => {
  const { handleImageChange, isError } = props

  const [isDragging, setIsDragging] = useState(false)

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files?.[0]) {
      const file = e.target.files[0]
      handleImageChange(file)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.items) {
      for (const item of e.dataTransfer.items) {
        if (item.kind === "file") {
          const file = item.getAsFile()
          if (file) {
            handleImageChange(file)
          }
        }
      }
    } else {
      for (const file of e.dataTransfer.files) {
        handleImageChange(file)
      }
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  return (
    <label htmlFor="input-file">
      <Input id="input-file" type="file" sx={visuallyHidden} onChange={onImageChange} />
      <Paper onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} sx={{ height: "100%" }}>
        <Card
          raised
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            border: "4px dashed",
            borderColor: isError ? "red" : "transparent",
            height: "100%",
            p: 2,
            opacity: isDragging ? 0.5 : 1,
            pointerEvents: isDragging ? "none" : "auto",
          }}
        >
          <CloudUploadIcon sx={{ width: "100%", minHeight: "40%" }} />
          <Typography variant="h6" noWrap>
            Drop image here
          </Typography>
          <Button variant="contained" aria-label="upload image" component="div" sx={{ width: "fit-content" }}>
            Choose image
          </Button>
        </Card>
      </Paper>
    </label>
  )
}
