import {defineStore} from 'pinia'


export const useChatStore = defineStore('chat-store', {

    state: () => ({
        messages: []
    }),
    getters: {},
    actions: {
        setCurrenttab(tab_index = 0) {
            this.currentTab = tab_index;
        },
        addMessage(message){
            this.state.messages.push(message);
        }
    },
})