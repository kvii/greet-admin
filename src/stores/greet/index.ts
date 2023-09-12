import { createGreeterClient } from '@/proto/helloworld/v1';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { KratosError, useKratosClient } from '@/stores/kratos';

/** 打招呼状态 */
export const useGreetStore = defineStore('greet', () => {
    const client = createGreeterClient(useKratosClient().handler)

    /** 名称 */
    const name = ref('')

    /** 说你好 */
    async function sayHello() {
        if (processing.value) {
            throw new Error('重复调用')
        }
        processing.value = true

        try {
            const reply = await client.SayHello({
                name: name.value,
            })
            message.value = reply.message!
        } catch (e) {
            if (e instanceof KratosError) {
                message.value = `kratos error: ${e.reason} ${e.message}`
            } else {
                message.value = `unknown error: ${e}`
            }
        } finally {
            processing.value = false
        }
    }

    /** 计算中 */
    const processing = ref(false)

    /** 响应信息 */
    const message = ref('')

    return {
        name,
        sayHello,
        message,
        processing,
    }
})