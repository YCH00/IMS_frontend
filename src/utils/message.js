import {ElMessage} from "element-plus";

/**
 * 封装的消息提示工具函数
 *
 * 使用 Element Plus 的 ElMessage 提供统一的消息提示功能。
 * 支持自定义消息内容、类型和持续时间。
 *
 * 使用方法：
 * 1. 确保项目已安装 Element Plus，并在项目入口处引入样式文件。
 * 2. 在需要显示消息的地方引入 showMessage 函数：
 *
 * import { showMessage } from '@/utils/message';
 *
 * 3. 调用方法：
 *
 * // 显示一条信息提示
 * showMessage('这是一个信息提示');
 *
 * // 显示一条成功提示
 * showMessage('恭喜你，操作成功！', 'success');
 *
 * // 显示一条警告提示
 * showMessage('请注意，存在潜在问题', 'warning');
 *
 * // 显示一条错误提示
 * showMessage('操作失败，请稍后重试', 'error');
 *
 * 可选参数：
 * - message (String): 要显示的提示消息（必填）
 * - type (String): 消息类型，可选值为 'info'（默认）、'success'、'warning'、'error'
 * - duration (Number): 持续时间，默认 3000 毫秒，可自行修改代码内的默认值
 */
export const showMessage = (message, type = 'info') => {
    ElMessage({
        message,
        type,
        duration: 3000, // 默认持续时间为 3 秒
        showClose: true, // 显示关闭按钮
    })
}
