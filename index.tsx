// @ts-nocheck
import { PropType, registerComponent } from '@uiflow/cli';
import { ethers } from 'ethers';


  let balance = 0;
  let account = '';

export default registerComponent('my-logic-component', {  
  name: 'Metamask',  
  init: ({ emit }) => {
        window.ethereum?.on('accountsChanged', (accounts) => {
            // Get the account and balance.
            account = accounts[0];
            window.ethereum.request({ method: 'eth_getBalance', params: [account, 'latest'] })
            .then(hexbalance => {
              // Return string value to convert it into int balance
              balance = ethers.utils.formatEther(hexbalance);
              emit('onChange', { account, balance });
            })
          })
  },  
  blocks: [
    {
      input: {
        type: PropType.Call,
        name: 'connect',
        arguments: [],
        onEmit({ inputs, emit }) {
          if(window.ethereum){
                window.ethereum.request({method:'eth_requestAccounts'})
                .then(res=>{
                    account = res[0];
                    window.ethereum.request({
                        method:'eth_getBalance', 
                        params: [account, 'latest']
              }).then(hexbalance => {
                        // Return string value to convert it into int balance
                        balance = ethers.utils.formatEther(hexbalance)
                        emit('onConnect', { account, balance });
              })                 
            })                
          }
          else {
                emit('onError', { error: 'Install Metamask to continue' })
          }
        },
      },
      output: [{
        type: PropType.Event,
        name: 'onConnect',
        arguments: [
          {
            name: 'account',
            type: PropType.String,
          },
          {
            name: 'balance',
            type: PropType.Number,
          }
        ]
      },
       {
        type: PropType.Event,
        name: 'onError',
        arguments: [
          {
            name: 'error',
            type: PropType.String,
          }
        ]
      }]      
    },
    {
      input: {
        type: PropType.Call,
        name: 'sign',
        arguments: [
          { 
            name: 'address',
            type: PropType.String,
          },
          { 
            name: 'message',
            type: PropType.String,
          }
        ],
        onEmit({ inputs, emit }) {
          console.log('Console --> entered sign')

          // console.log(await window.ethereum.request({
          //   method: 'eth_sendTransaction',
          //   params: [txConfig],
          // }));       

          window.ethereum.request({
            method: 'personal_sign',
            params: [inputs.address, inputs.message],
          }).then(resp => {
            const response = resp;
            console.log('Console --> ' + response)
            emit('onSuccess', { response })
          }).catch(resp => {
            console.log('Console --> ' + resp.code + ' -- ' + resp.message)
            const error = resp
            emit('onError', {error}) 
          })
        },
      },
      output: [{
        type: PropType.Event,
        name: 'onSuccess',
        arguments: [
          {
            name: 'response',
            type: PropType.String,
          }
        ]
      },
      {
        type: PropType.Event,
        name: 'onError',
        arguments: [
          {
            name: 'error',
            type: PropType.Object,
          }
        ]
      }]      
    },    
    {
      input: {
        type: PropType.Call,
        name: 'transact',
        arguments: [
        { 
          name: 'data',
          type: PropType.Object,
        }],
        onEmit({ inputs, emit }) {
          console.log('Console --> ' + JSON.stringify(inputs.data))

          const txConfig = inputs.data;
          txConfig.gasPrice = txConfig.gasPrice ? parseInt(txConfig.gasPrice).toString(16) : undefined;

          console.log('Console --> ' + JSON.stringify(txConfig.gasPrice))

          // console.log(await window.ethereum.request({
          //   method: 'eth_sendTransaction',
          //   params: [txConfig],
          // }));

          window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [txConfig],
          }).then(resp => {
            const response = resp;
            console.log('Console --> ' + response)
            emit('onSuccess', { response })
          }).catch(resp => {
            console.log('Console --> ' + resp.code + ' -- ' + resp.message)
            const error = resp
            emit('onError', {error})
          })

          //emit('onSuccess', {response: { response } });
        //   if(window.ethereum){
        //         window.ethereum.request({method:'eth_requestAccounts'})
        //         .then(res=>{
        //             account = res[0];
        //             window.ethereum.request({
        //                 method:'eth_getBalance', 
        //                 params: [account, 'latest']
        //       }).then(hexbalance => {
        //                 // Return string value to convert it into int balance
        //                 balance = ethers.utils.formatEther(hexbalance)
        //                 emit('onSuccess', { account, balance });
        //       })                 
        //     })                
        //   }
        //   else {
        //         emit('onError', 'Transaction error' )
        //   }
        },
      },
      output: [{
        type: PropType.Event,
        name: 'onSuccess',
        arguments: [
          {
            name: 'response',
            type: PropType.String,
          }
        ]
      },
      {
        type: PropType.Event,
        name: 'onError',
        arguments: [
          {
            name: 'error',
            type: PropType.Object,
          }
        ]
      }]      
    },       
    { 
      output: {
        type: PropType.Event,
        name: 'onChange',
        arguments: [
          {
            name: 'account',
            type: PropType.String,
          },
          {
            name: 'balance',
            type: PropType.Number,
          }
        ]
      }
    },
  ]
});