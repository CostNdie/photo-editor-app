<template>
  <v-container fluid class="editor-wrapper pa-4 fill-height d-flex flex-column justify-space-between">
    <!-- Top Quote -->
    <div class="text-center mb-4 quote">
      "Creativity begins with a single click."
    </div>

    <!-- Centered Image Editor Area -->
    <div class="canvas-wrapper d-flex justify-center align-center">
      <div class="canvas-container">
        <canvas
          ref="canvas"
          :width="containerWidth"
          :height="containerHeight"
          @mousedown="startCrop"
          @mousemove="moveCrop"
          @mouseup="endCrop"
          @touchstart.prevent="startCrop"
          @touchmove.prevent="moveCrop"
          @touchend.prevent="endCrop"
        />
      </div>
    </div>

    <!-- Upload Section -->
    <v-row class="mt-4 mb-2 justify-center">
      <v-col cols="12" class="d-flex justify-center">
        <v-btn
          color="blue"
          dark
          class="ma-2"
          @click="$refs.fileInput.click()"
        >
          <v-icon left>mdi-image-plus</v-icon>
          Upload a Photo
        </v-btn>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="d-none"
          @change="onImageUpload($event.target.files[0])"
        />
      </v-col>
    </v-row>

    <!-- Bottom Tools -->
    <v-row class="tool-row mt-2 mb-2 justify-center" no-gutters>
      <v-btn @click="selectTool('crop')" :color="activeTool === 'crop' ? 'primary' : 'grey darken-3'" class="mx-2">
        Crop
      </v-btn>
      <v-btn @click="selectTool('text')" :color="activeTool === 'text' ? 'primary' : 'grey darken-3'" class="mx-2">
        Text
      </v-btn>
      <v-btn @click="selectTool('brightness')" :color="activeTool === 'brightness' ? 'primary' : 'grey darken-3'" class="mx-2">
        Brightness
      </v-btn>
      <v-btn @click="flipImage" color="grey darken-2" class="mx-2">Flip</v-btn>
      <v-btn @click="resetImage" color="grey darken-2" class="mx-2">Reset</v-btn>
      <v-btn @click="downloadImage" color="blue darken-2" class="mx-2">Download</v-btn>
    </v-row>

    <!-- Apply Crop Button -->
    <div class="text-center my-2" v-if="activeTool === 'crop' && hasCrop">
      <v-btn color="success" @click="cropImage">✅ Apply Crop</v-btn>
    </div>

    <!-- Slide-out Settings Panel -->
    <v-slide-x-transition>
      <v-card
        flat
        class="settings-panel px-4 pt-2 pb-4"
        v-if="activeTool === 'text' || activeTool === 'brightness'"
      >
        <div v-if="activeTool === 'brightness'">
          <h4 class="white--text mb-2">Brightness</h4>
          <v-slider v-model="brightness" min="0" max="2" step="0.1" @input="drawImage" />
        </div>
        <div v-if="activeTool === 'text'">
          <h4 class="white--text mb-2">Text Options</h4>
          <v-text-field
            v-model="text"
            label="Text"
            outlined
            dense
            class="text-center-input"
            @input="drawImage"
          />
          <v-color-picker v-model="textColor" flat hide-canvas show-swatches @input="drawImage" />
          <v-slider v-model="fontSize" min="12" max="72" label="Font Size" @input="drawImage" />
        </div>
      </v-card>
    </v-slide-x-transition>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      image: null,
      originalImage: null,
      containerWidth: 600,
      containerHeight: 400,
      brightness: 1,
      text: '',
      textColor: '#FF0000',
      fontSize: 30,
      textPosition: { x: 30, y: 50 },
      cropping: false,
      cropStart: null,
      cropEnd: null,
      hasCrop: false,
      flipped: false,
      activeTool: null,
      scale: 1,
    }
  },
  mounted() {
    this.updateCanvasSize()
    window.addEventListener('resize', this.updateCanvasSize)
    this.drawPlaceholder()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateCanvasSize)
  },
  methods: {
    updateCanvasSize() {
      const maxWidth = Math.min(window.innerWidth - 32, 600)
      const height = maxWidth * 2 / 3
      this.containerWidth = maxWidth
      this.containerHeight = height
      if (this.originalImage) this.drawImage()
    },
    selectTool(tool) {
      this.activeTool = this.activeTool === tool ? null : tool
    },
    drawPlaceholder() {
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#444'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#aaa'
      ctx.font = '18px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Upload an image to start editing', canvas.width / 2, canvas.height / 2)
    },
    onImageUpload(file) {
      if (!file) return
      const reader = new FileReader()
      reader.onload = e => {
        const img = new Image()
        img.onload = () => {
          this.originalImage = img
          this.calcScale()
          this.image = img
          this.resetTransforms()
          this.drawImage()
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    },
    calcScale() {
      const iw = this.originalImage.width
      const ih = this.originalImage.height
      const cw = this.containerWidth
      const ch = this.containerHeight
      this.scale = Math.min(cw / iw, ch / ih, 1)
    },
    resetTransforms() {
      this.brightness = 1
      this.fontSize = 30
      this.flipped = false
      this.hasCrop = false
      this.cropStart = null
      this.cropEnd = null
      this.textPosition = { x: 30, y: 50 }
    },
    drawImage() {
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      ctx.filter = `brightness(${this.brightness})`
      const iw = this.originalImage.width
      const ih = this.originalImage.height
      const sw = iw * this.scale
      const sh = ih * this.scale
      const dx = (canvas.width - sw) / 2
      const dy = (canvas.height - sh) / 2
      if (this.flipped) {
        ctx.translate(canvas.width, 0)
        ctx.scale(-1, 1)
      }
      ctx.drawImage(this.originalImage, dx, dy, sw, sh)
      ctx.restore()
      if (this.cropping && this.cropStart && this.cropEnd) {
        const { x, y, w, h } = this.getCropRect()
        ctx.strokeStyle = 'blue'
        ctx.lineWidth = 2
        ctx.strokeRect(x, y, w, h)
      }
      if (this.text) {
        ctx.fillStyle = this.textColor
        ctx.font = `${this.fontSize}px Arial`
        ctx.fillText(this.text, this.textPosition.x, this.textPosition.y)
      }
    },
    cropImage() {
      if (!this.hasCrop) return
      const { x, y, w, h } = this.getCropRect()
      const tmp = document.createElement('canvas')
      tmp.width = w
      tmp.height = h
      tmp.getContext('2d').drawImage(this.$refs.canvas, x, y, w, h, 0, 0, w, h)
      const cropped = new Image()
      cropped.onload = () => {
        this.originalImage = cropped
        this.calcScale()
        this.image = cropped
        this.hasCrop = false
        this.activeTool = null
        this.textPosition = { x: 30, y: 50 }
        this.drawImage()
      }
      cropped.src = tmp.toDataURL()
    },
    flipImage() {
      this.flipped = !this.flipped
      this.drawImage()
    },
    downloadImage() {
      const canvas = this.$refs.canvas
      const a = document.createElement('a')
      a.href = canvas.toDataURL()
      a.download = 'edited-image.png'
      a.click()
    },
    resetImage() {
      if (this.originalImage?.src) {
        const img = new Image()
        img.onload = () => {
          this.originalImage = img
          this.calcScale()
          this.resetTransforms()
          this.image = img
          this.drawImage()
        }
        img.src = this.originalImage.src
      } else {
        this.drawPlaceholder()
      }
    },
    getPoint(e) {
      const rect = this.$refs.canvas.getBoundingClientRect()
      const t = e.touches ? e.touches[0] : e
      return { x: t.clientX - rect.left, y: t.clientY - rect.top }
    },
    startCrop(e) {
      if (this.activeTool !== 'crop') return
      this.cropping = true
      this.cropStart = this.getPoint(e)
    },
    moveCrop(e) {
      if (!this.cropping) return
      this.cropEnd = this.getPoint(e)
      this.hasCrop = true
      this.drawImage()
    },
    endCrop() {
      this.cropping = false
    },
    getCropRect() {
      const sx = this.cropStart.x, sy = this.cropStart.y
      const ex = this.cropEnd.x, ey = this.cropEnd.y
      const x = Math.min(sx, ex), y = Math.min(sy, ey)
      const w = Math.abs(ex - sx), h = Math.abs(ey - sy)
      return { x, y, w, h }
    }
  }
}
</script>

<style scoped>
.editor-wrapper {
  background-color: #121212;
  color: white;
  min-height: 100vh;
}

.canvas-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.canvas-container {
  width: 100%;
  max-width: 600px;
  aspect-ratio: 3 / 2;
  background-color: #2c2c2c;
  border: 2px dashed #555;
  display: flex;
  align-items: center;
  justify-content: center;
}

canvas {
  max-width: 100%;
  max-height: 100%;
  touch-action: none;
  user-select: none;
}

.tool-row {
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.settings-panel {
  background-color: #1e1e1e;
  border-radius: 12px;
  margin: 0 auto;
  max-width: 480px;
  max-height: 50vh;
  overflow-y: auto;
}

.quote {
  font-size: 1.1rem;
  font-style: italic;
  color: #ccc;
}

.d-none {
  display: none;
}

.text-center-input input {
  text-align: center;
}
</style>
