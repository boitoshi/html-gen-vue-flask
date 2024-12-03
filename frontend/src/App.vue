<template>
  <div id="app">
    <!-- タブ表示部分 -->
    <div class="tab-container">
      <button 
        v-for="sheetName in sheetNames" 
        :key="sheetName"
        :class="{ active: currentSheet === sheetName }"
        @click="selectSheet(sheetName)">
        {{ sheetName }}
      </button>
    </div>

    <!-- トレーナー選択部分 -->
    <div v-if="currentSheet" class="trainer-selection">
      <select v-model="selectedTrainer">
        <option value="">トレーナーを選択してください</option>
        <option v-for="trainer in trainers" :key="trainer" :value="trainer">
          {{ trainer }}
        </option>
      </select>
      <button @click="showPokemonData" :disabled="!selectedTrainer">
        表示
      </button>
    </div>

    <!-- ポケモンデータ表示部分 -->
    <div v-if="pokemonData" class="pokemon-data">
      <div class="template-preview">
        <h3>プレビュー</h3>
        <div v-html="pokemonData"></div>
      </div>
      <div class="template-code">
        <h3>HTMLコード</h3>
        <button @click="copyToClipboard">コピー</button>
        <pre><code>{{ pokemonData }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'App',
  data() {
    return {
      sheetNames: [],
      currentSheet: null,
      trainers: [],
      selectedTrainer: '',
      pokemonData: null
    }
  },
  async created() {
    try {
      // 初期データの取得
      const response = await axios.get('/')
      this.sheetNames = response.data.sheet_names
    } catch (error) {
      console.error('データの取得に失敗しました:', error)
    }
  },
  methods: {
    async selectSheet(sheetName) {
      this.currentSheet = sheetName
      this.selectedTrainer = ''
      this.pokemonData = null
      
      try {
        const response = await axios.post('/get_trainers', {
          sheet_name: sheetName
        })
        this.trainers = response.data.trainers
      } catch (error) {
        console.error('トレーナー情報の取得に失敗しました:', error)
      }
    },
    async showPokemonData() {
      if (!this.selectedTrainer) return

      try {
        const response = await axios.post('/get_entries', {
          sheet_name: this.currentSheet,
          trainer: this.selectedTrainer
        })
        this.pokemonData = response.data.html
      } catch (error) {
        console.error('ポケモンデータの取得に失敗しました:', error)
      }
    },
    copyToClipboard() {
      if (!this.pokemonData) return
      
      navigator.clipboard.writeText(this.pokemonData)
        .then(() => alert('コピーしました'))
        .catch(err => console.error('コピーに失敗しました:', err))
    }
  }
}
</script>

<style scoped>
.tab-container {
  margin-bottom: 20px;
}

.tab-container button {
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  background-color: #f0f0f0;
  cursor: pointer;
}

.tab-container button.active {
  background-color: #007bff;
  color: white;
}

.trainer-selection {
  margin-bottom: 20px;
}

.trainer-selection select {
  margin-right: 10px;
  padding: 5px;
}

.pokemon-data {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.template-code {
  position: relative;
}

.template-code pre {
  background-color: #f5f5f5;
  padding: 15px;
  overflow-x: auto;
}

.template-code button {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
