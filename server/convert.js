import fs from "fs"
import wav from "node-wav"
import ffmepeg from "fluent-ffmpeg"
import ffmepegStatic from "ffmpeg-static"
import { rejects } from "assert"
import Ffmpeg from "fluent-ffmpeg"

const filepath = "./tmp/audio.mp4"
const outputPath = filepath.replace(".mp4", ".wav")

export const convert = () =>
  new Promise((resolve, reject) => {
    console.log("Convertendo o vídeo...")

    Ffmpeg.setFfmpegPath(ffmepegStatic)
    ffmepeg()
      .input(filepath)
      .audioFrequency(16000)
      .audioChannels(1)
      .format("wav")
      .on("end", () => {
        const file = fs.readFileSync(outputPath)
        const fileDecoded = wav.decode(file)

        const audioData = fileDecoded.channelData[0]
        const floatArray = new Float32Array(audioData)

        console.log("Vídeo convertido com sucesso!")

        resolve(floatArray)
        fs.unlinkSync(outputPath)
      })
      .on("error", (error) => {
        console.log("Erro ao converter o video", error)
        reject(error)
      })
      .save(outputPath)
  })
