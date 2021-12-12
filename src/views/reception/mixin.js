// 电子秤相关的逻辑
export default {
    async mounted() {
        console.log('mounted');
        let [port] = await navigator.serial.getPorts();
        if (!port) {
            this.$confirm('要链接电子秤吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info',
                })
                .then(async () => {
                    this.getSerialPort();
                })
                .catch(() => {
                    this.currentWeight = '';
                    console.log('不连接串口！');
                });
        } else {
            this.connectPort(port);
        }
    },

    methods: {
        async connectPort(port) {
            let keepReading = true;
            const textDecoder = new window.TextDecoderStream();
            const reader = textDecoder.readable.getReader();
            if (!port.readable) {
                await port.open({
                    baudRate: 9600,
                }); // set baud rate
                this.$baseMessage('电子秤链接成功')
                port.readable.pipeTo(textDecoder.writable);

            }

            while (port.readable && keepReading) {
                try {
                    const {
                        value,
                        done
                    } = await reader.read();
                    if (done) {
                        reader.releaseLock();
                        break;
                    }
                    if (value) {
                        const _value = (Array.from(value.match(/[0-9]+\.[0-9]+/) || [])[0]);
                        if (_value && this.currentWeight !== _value) {
                            this.currentWeight = _value || '00.000';
                        }
                    }
                    // }
                } catch (error) {
                    console.error(error);
                } finally {
                    // console.log(port.readable, keepReading);
                }
            }
            await port.close();
            console.log('port closed');
        },

        async getSerialPort() {
            if ('serial' in navigator) {
                const port = await navigator.serial.requestPort();
                this.connectPort(port);
            }
        },
    }
}