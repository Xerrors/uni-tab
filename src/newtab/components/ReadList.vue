<template>
  <div :class="[{ 'readlist-hidden': readlist.length == 0 }, 'readlist-container']">
    <div class="title" @click="readContainer.scrollLeft = 0">
      <span>稍</span>
      <span>后</span>
      <span>阅</span>
      <span>读</span>
      <span class="count">{{readlist.length}}</span>
    </div>
    <div ref="readContainer" class="readlist">
      <div class="read-item" v-for="(item, idx) in readlist" :key="idx">
        <a class="read-card">
          <a class="card__title" :href="item.url">{{ item.title }}</a>
          <div class="card__info">
            <span class="card__domain">{{ item.domain }}</span>
            <span class="card__time">{{ item.fmtTime }}</span>
            <button @click="delReadCard(item.url)" id="readedBtn">已读</button>
          </div>
        </a>
      </div>
    </div>
    <div class="next"  @click="readContainer.scrollLeft += 192"> > </div>
  </div>
</template>


<script setup>
import { onMounted, ref, watch } from "vue";
import { formatTime } from "@/utils/format";
import { store, saveStoreUserConfigToStorage } from "@/plugins/store";

const readlist = ref([]);
const readContainer = ref(null);

const praseReadlist = (list) => {
  list = JSON.parse(JSON.stringify(list))
  readlist.value = list.map(item => {
    item.domain = item.url.split('/')[2];
    item.fmtTime = formatTime(item.time)
    return item;
  });
}

const delReadCard = (url) => {
  store.userConfig.readList.map((item, i) => {
    if (item.url == url) {
      store.userConfig.readList.splice(i, 1);
    }
  })
  praseReadlist(store.userConfig.readList)
  saveStoreUserConfigToStorage()
}

onMounted(() => {
  praseReadlist(store.userConfig.readList)
  readContainer.value.addEventListener("wheel", (event) => {
    event.preventDefault();
    readContainer.value.scrollIntoView({ behavior: 'smooth' })
    readContainer.value.scrollLeft += event.deltaY;
  });
})

watch(() => store.userConfig.readList, value => {
  praseReadlist(value)
})


</script>
 
<style lang="less" scoped>
.readlist-container.readlist-hidden {
  display: none;
}

.readlist-container {
  width: 100%;
  height: var(--readcatd-height);
  display: flex;
  position: relative;

  >* {
    height: 100%;
    user-select: none;
  }

  .title {
    width: 88px;
    font-size: 1rem;
    padding: 0 1.6rem;
    // height: auto;
    box-sizing: border-box;
    // box-shadow: 0 0 1px 1px rgb(0 0 0 / 5%);
    // border: 1px solid var(--border-color);
    // border-radius: 4px;
    // text-align: center;
    // writing-mode: vertical-lr;
    // letter-spacing: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    gap: 4px;

    & > .count {
      margin-top: 4px;
      border-radius: 50%;
      background-color: var(--theme-color);
      color: white;
      width: 1re;
      width: 1rem;
      height: 1rem;
      font-size: 0.8rem;
      line-height: 100%;
      padding: 2px;
      text-align: center;
    }

    &::before, &::after {
      content: "";
      position: absolute;
      width: 12px;
      height: 12px;
    }

    &::before {
      top: 0;
      left: 0;
      border-top: 3px solid var(--theme-color);
      border-left: 3px solid var(--theme-color);
    }

    &::after {
      right: 0;
      bottom: 0;
      border-right: 3px solid var(--theme-color);
      border-bottom: 3px solid var(--theme-color);
    }
  }

  &::before {
    z-index: 1;
    content: "";
    width: 60px;
    height: 100%;
    position: absolute;
    right: 40px;
    background: linear-gradient(to right, rgba(0, 0, 0, 0), var(--bg-color));
  }
}

.readlist-container .readlist {
  flex-grow: 1;
  position: relative;
  white-space: nowrap;
  overflow-x: scroll;
  overflow-y: hidden;
  height: 100%;
  transition: all 0.1s;
  scroll-behavior: smooth;
  padding-right: 80px;
  scroll-snap-type: x mandatory;
  scroll-padding: 12px;

  &::-webkit-scrollbar {
    display: none;
    /* Chrome Safari */
  }

  scrollbar-width: none;
  /* Firefox */
}

.readlist>.read-item {
  width: var(--readcard-width);
  display: inline-block;
  margin-left: 12px;
  height: 100%;
  scroll-snap-align: start;
}

.readlist>.read-item>.read-card {
  display: block;
  height: 100%;
  color: inherit;
  border: 1px solid var(--border-color);
  // border-radius: 4px;
  box-sizing: border-box;
  position: relative;

  text-decoration-line: none;

  a.card__title {
    color: var(--text-main-color);
    font-size: 0.9rem;
    line-height: 1.5rem;
    margin: 16px 12px;
    height: 72px;
    text-decoration: none;
    overflow: hidden;
    white-space: break-spaces;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    transition: all 0.1s ease-in-out;
  }

  &:hover button#readedBtn {
    cursor: pointer;
    opacity: 1;
  }

  &:hover a.card__title {
      color: var(--theme-color-40);
      margin-top: 20px;
      margin-bottom: 12px;
  }
}

.readlist>.read-item>.read-card>div.card__info {
  padding: 0 12px;
  // background-color: antiquewhite;

  &>* {
    font-size: small;
    display: inline-block;
    line-height: 20px;
    margin: 4px 0;
  }

  span.card__domain {
    width: fit-content;
    display: block;
    border-bottom: 1px dashed var(--text-gray-color);
    color: var(--text-gray-color);
  }

  span.card__time {
    width: 100px;
  }

  button {
    opacity: 0;
    margin-left: auto;
    float: right;
    border: none;
    background: transparent;
    transition: all 0.3s ease-in-out;
    color: var(--text-gray-color);

    &:hover {
      cursor: pointer;
      pointer-events: auto;
      color: var(--text-secondry-color);
    }
  }
}

.readlist-container .next {
    z-index: 2;
    height: 100%;
    width: 40px;
    background: var(--bg-color);
    text-align: center;
    line-height: var(--readcatd-height);
    user-select: none;
    cursor: pointer;
    position: absolute;
    right: 0;
}
</style>