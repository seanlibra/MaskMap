<template>
  <div id="preloader">
    <h2>
      <div>搜口罩</div>
      <div class="eng_title">Seach Mask</div>
    </h2>
    <div class="masker_group">
      <img class="masker" src="../assets/preloader_icon.svg" alt="" />
      <div class="shadow"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#preloader {
  font-family: 'Noto Sans TC', sans-serif;
  position: absolute;
  top:0;
  left:0;
  right: 0;
  bottom: 0;
  background: var(--color-main);
  z-index: 9999;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  h2 {
    color:#ffffff;
    text-align: center;
    font-size: 2rem;
    margin-bottom: 20px;
    .eng_title {
      margin-top: 20px;
      font-family: 'Rubik', sans-serif;
    }
  }
  .masker_group {
    position: absolute;
    top:55%;
    left:50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .masker {
    filter: drop-shadow(0px 0px 2px white);
    position: relative;
    animation: hop .8s infinite;
  }
  .shadow {
    width:40px;
    height:5px;
    background:#eaeaea;
    border-radius:100%;
    position: relative;
    top:30px;
    animation: shadow .8s infinite;
  }
  @keyframes hop{
  0%{
    top:10px;
  }
  50%{
    top:30px;
  }
  100%{
    top:10px;
  }
  }
  @keyframes shadow {
    0%,100% {
      width: 40px;
    }
    50% {
      width: 50px;
      height:10px;
    }
  }
}
</style>
