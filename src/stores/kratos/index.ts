import { defineStore } from "pinia";

export interface KratosErrorInit {
    /**
     * 响应码，与服务端响应码一致。
     * 客户端应直接判断 http 响应码，不应与该字段交互。
     */
    code: number;

    /**
     * 错误原因，该原因为可枚举的字符串，
     * 可供开发着判断错误类型。
     */
    reason: string;

    /** 错误说明，供用户界面展示用。 */
    message: string;

    /** 元信息 */
    metadata: Record<string, string>;
}

/** 
 * Kratos 错误类型。在调用 http 接口时，若响应码非 200 则
 * 响应体一定是该类型的 json 数据。
 */
export class KratosError {
    /**
     * 响应码，与服务端响应码一致。
     * 客户端应直接判断 http 响应码，不应与该字段交互。
     */
    code: number;

    /**
     * 错误原因，该原因为可枚举的字符串，
     * 可供开发着判断错误类型。
     */
    reason: string;

    /** 错误说明，供用户界面展示用。 */
    message: string;

    /** 元信息 */
    metadata: Record<string, string>;

    constructor(value: KratosErrorInit) {
        this.code = value.code
        this.reason = value.reason
        this.message = value.message
        this.metadata = value.metadata
    }
}

/** 请求类型 */
export interface RequestType {
    path: string;
    method: string;
    body: string | null;
}

/** 请求处理函数 */
export interface RequestHandler {
    (request: RequestType, meta: { service: string, method: string }): Promise<unknown>;
}

/** kratos http 客户端接口。  */
export interface KratosClient {
    /** http client。添加 kratos 错误处理逻辑。 */
    handler: RequestHandler
}

/** 定义 kratos http 客户端 */
export const useKratosClient = defineStore('client', (): KratosClient => {
    async function handler(request: RequestType, meta: { service: string, method: string }): Promise<unknown> {
        const resp = await fetch(request.path, {
            method: request.method,
            body: request.body,
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (resp.status >= 200 && resp.status <= 299) {
            return await resp.json()
        }

        const data: KratosErrorInit = await resp.json()
        throw new KratosError({
            code: data.code,
            reason: data.reason,
            message: data.message,
            metadata: data.metadata,
        })
    }

    return {
        handler,
    }
})