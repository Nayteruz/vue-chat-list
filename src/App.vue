<template>
  <div class="view login" v-if="state.username === '' || state.username === null">
    <form class="login-form" @submit.prevent="Login">
      <div class="form-inner">
        <h1>Авторизация в чате</h1>
        <label for="username">Имя пользователя</label>
        <input type="text" v-model="inputUsername" placeholder="Введите свое имя">
        <input type="submit" value="Войти">
      </div>
    </form>
  </div>
  <div class="view chat" v-else>
    <header>
      <button class="logout" @click="logout">Выйти</button>
      <h1>Привет, {{ state.username }}</h1>
    </header>
    <section class="chat-box">
      <div
          class="list"
          v-for="message in storeChat.messages"
          :key="message.key"
          :class="{'message current-user': message.username === state.username, 'message' : true}"
      >
        <div class="message-inner">
          <div class="username">{{ message.username }}</div>
          <div class="content">{{ message.content }}</div>
        </div>
      </div>
    </section>
    <footer>
      <form class="" @submit.prevent="sendMessage">
        <input type="text" v-model="inputMessage" placeholder="Сообщение...">
        <input type="submit" value="Отправить">
      </form>
    </footer>
  </div>
</template>

<script>
import {reactive, onMounted, ref } from "vue";
import { db, ref_db, set_db, child_db, get_db } from "./db.js"
import {useChatStore} from "@/store/chat-store";

export default {
  name: 'App',
  components: {},
  setup() {
    const inputUsername = ref('');
    const inputMessage = ref('');
    const storeChat = useChatStore();

    const state = reactive({
      username: '',
      messages: [],
    })

    const Login = () => {
      if(inputUsername.value !== '' || inputUsername.value !== null){
        state.username = inputUsername.value
        inputUsername.value = '';
      }
    }

    const sendMessage = () => {
      if (inputMessage.value === ''){
        return;
      }

      const messageU = {
        username: state.username,
        content: inputMessage.value
      }

      set_db(ref_db(db, 'messages/' + Date.now()), {...messageU})
        .then(() => {
          inputMessage.value = "";
          getMessageList();
          toScrool();
        })
        .catch((e)=>{
          alert('Error: ' + e)
        })
    }

    const getMessageList = () => {
      const dbRef = ref_db(db);
      get_db(child_db(dbRef, 'messages/')).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          let messagesU = [];

          Object.keys(data).forEach(key=>{
            messagesU.push({
              id:key,
              username: data[key].username,
              content: data[key].content
            })
          })
          storeChat.messages = messagesU;
          localStorage.setItem('messages', Date.now().toString());
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
    }

    const toScrool = () => {
      let box = document.querySelector('.chat-box');
      let height = box.scrollHeight + box.offsetHeight;
      setTimeout(()=>{
        box.scroll({
          left:0,
          top:height,
          behavior: 'smooth'
        })
      },500)
    }

    const updateOnLocalStorage = () => {
      window.addEventListener('storage', (event) => {
        if (event.storageArea !== localStorage) return;
        if (event.key === 'messages') {
          getMessageList()
        }
      });
    }

    const logout = () => {
      state.username = '';
    }

    onMounted(()=>{
      getMessageList()
      updateOnLocalStorage();
    })

    return {
      inputUsername,
      inputMessage,
      Login,
      state,
      sendMessage,
      storeChat,
      logout
    }
  }

}
</script>

<style lang="scss">

@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

* {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  max-width: 500px;
  margin: 0 auto;
}

.view {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  background-color: #ea526f;
  padding: 0 20px;

  &.login {
    align-items: center;

    .login-form {
      display: block;
      width: 100%;
      padding: 15px;

      .form-inner {
        display: block;
        background-color: #FFF;
        padding: 50px 15px;
        border-radius: 16px;
        box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);

        h1 {
          color: #AAA;
          font-size: 28px;
          margin-bottom: 30px;
        }

        label {
          display: block;
          margin-bottom: 5px;
          color: #AAA;
          font-size: 16px;
          transition: 0.4s;
        }

        input[type="text"] {
          appearance: none;
          border: none;
          outline: none;
          background: none;
          display: block;
          width: 100%;
          padding: 10px 15px;
          border-radius: 8px;
          margin-bottom: 15px;

          color: #333;
          font-size: 18px;
          box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
          background-color: #F3F3F3;
          transition: 0.4s;

          &::placeholder {
            color: #888;
            transition: 0.4s;
          }
        }

        input[type="submit"] {
          appearance: none;
          border: none;
          outline: none;
          background: none;
          display: block;
          width: 100%;
          padding: 10px 15px;
          background-color: #ea526f;
          border-radius: 8px;
          color: #FFF;
          font-size: 18px;
          font-weight: 700;
        }

        &:focus-within {
          label {
            color: #ea526f;
          }

          input[type="text"] {
            background-color: #FFF;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);

            &::placeholder {
              color: #666;
            }
          }
        }
      }
    }
  }

  &.chat {
    flex-direction: column;
    height: 100vh;

    header {
      position: relative;
      display: block;
      width: 100%;
      padding: 50px 30px 10px;
      top:0;
      z-index: 1;
      background: #fff;
      box-shadow: 0 0 5px 0 rgb(0,0,0,0.3);

      .logout {
        position: absolute;
        top: 15px;
        right: 15px;
        appearance: none;
        border: none;
        outline: none;
        background: none;

        color: #1776bb;
        font-size: 18px;
        margin-bottom: 10px;
        text-align: right;
      }

      h1 {
        color: #1776bb;
        font-size: 25px;
      }
    }

    .chat-box {
      background-color: #FFF;
      box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);
      flex: 1 1 100%;
      padding: 30px;
      overflow-y:auto;

      .message {
        display: flex;
        margin-bottom: 15px;

        .message-inner {
          .username {
            color: #888;
            font-size: 16px;
            margin-bottom: 5px;
            padding-left: 15px;
            padding-right: 15px;
          }

          .content {
            display: inline-block;
            padding: 10px 20px;
            background-color: #F3F3F3;
            border-radius: 999px;
            color: #333;
            font-size: 18px;
            line-height: 1.2em;
            text-align: left;
          }
        }

        &.current-user {
          margin-top: 30px;
          justify-content: flex-end;
          text-align: right;

          .message-inner {
            max-width: 75%;

            .content {
              color: #FFF;
              font-weight: 600;
              background-color: #ea526f;
            }
          }
        }
      }
    }

    footer {
      position: relative;
      background-color: #FFF;
      padding: 30px;
      box-shadow: 0px 0px 12px rgba(100, 100, 100, 0.2);

      form {
        display: flex;

        input[type="text"] {
          flex: 1 1 100%;
          appearance: none;
          border: none;
          outline: none;
          background: none;
          display: block;
          width: 100%;
          padding: 10px 15px;
          border-radius: 8px 0px 0px 8px;

          color: #333;
          font-size: 18px;
          box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
          background-color: #F3F3F3;
          transition: 0.4s;

          &::placeholder {
            color: #888;
            transition: 0.4s;
          }
        }

        input[type="submit"] {
          appearance: none;
          border: none;
          outline: none;
          background: none;
          display: block;
          padding: 10px 15px;
          border-radius: 0px 8px 8px 0px;
          background-color: #ea526f;
          color: #FFF;
          font-size: 18px;
          font-weight: 700;
        }
      }
    }
  }
}
</style>
