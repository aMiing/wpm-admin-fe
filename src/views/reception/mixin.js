// 电子秤相关的逻辑
export default{
    
  async mounted() {
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
          console.log('不连接串口！');
        });
    } else {
      this.connectPort(port);
    }
  },
    
    methods: {
        async connectPort(port) {
            await port.open({
              baudRate: 9600,
            }); // set baud rate
            this.$baseMessage('电子秤链接成功')
            let keepReading = true;
      
            const textDecoder = new window.TextDecoderStream();
            port.readable.pipeTo(textDecoder.writable);
            const reader = textDecoder.readable.getReader();
      
            while (port.readable && keepReading) {
              try {
                const { value, done } = await reader.read();
      
                if (done) {
                  reader.releaseLock();
                  break;
                }
                if (value) {
                  const _value = Array.from(value.match(/[0-9]+\.[0-9]+/) || [])[0];
                  if (_value && this.weight !== _value) {
                    // console.log(_value)
                    this.weight = _value || '0.000';
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