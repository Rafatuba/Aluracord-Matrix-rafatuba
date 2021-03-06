import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js'
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';


// Como fazer AJAX: https://medium.com/@omariosouto/entendendo-como-fazer-ajax-com-a-fetchapi-977ff20da3c6

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzM3NjU4MSwiZXhwIjoxOTU4OTUyNTgxfQ.M1zjwpCCUYwKvov8gAuHc40DEMu-pOnHjmqlpAZmFfE'
const SUPABASE_URL = 'https://huqaqwlenvyfixexqtsv.supabase.co'
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutaMensagensEmTempoReal(adicionaMensagem) {
    return supabaseClient
    .from('Mensagens')
    .on('INSERT', (respostaLive) => {
        adicionaMensagem(respostaLive.new);
    })
    .subscribe();
}


export default function ChatPage() {
    const roteamento = useRouter();
    const usuarioLogado = roteamento.query.username;
    console.log('usuarioLogado', usuarioLogado);
    console.log('roteamento.query',roteamento.query);
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagem, setListaDeMensagem] = React.useState([
       /* {
            id: 1,
            de: 'rafatuba',
            texto: ':sticker: https://www.alura.com.br/imersao-react-4/assets/figurinhas/Figurinha_1.png',
        } */
    ]);

   React.useEffect(() => {
        supabaseClient
            .from('Mensagens')
            .select('*')
            .order('id', {ascending: false})
            .then(({data}) => {
                console.log('Dados da consulta:', data);
                setListaDeMensagem(data);
            });

            escutaMensagensEmTempoReal((novaMensagem) => {
                console.log('Nova mensagem', novaMensagem);
                //quero reusar um valor de referência (objeto/array)
                // passar uma função pro setState
                setListaDeMensagem((valorAtualDaLista) => {
                    return [
                        novaMensagem,
                        ...valorAtualDaLista,            
              ]
                });
            });
    }, []);
   
    
    /* Sua lógica vai aqui

    //Usuário:
    - Usuário digita no campo textarea
    - Aperta Enter para enviar
    - Adicionar o texto na listagem

    fetch('https://api.github.com/users/rafatuba')
    .then(async (respostaDoServidor) => {
        const respostaEsperada = await respostaDoServidor.json();
        console.log(respostaEsperada);
    })

    // DEV:
    - [x] Campo criado
    - [x] Usar o onChange e o useState (ter if pra caso seja enter pra limpar a variável)
    - [x] Lista de mensagens
    */
    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            //id: listaDeMensagem.length,
            de: usuarioLogado,
            texto: novaMensagem,
        };

    

        supabaseClient
            .from('Mensagens')
            .insert([
                mensagem 
            ])
            .then(({data}) => {
                //console.log('Criando mensagem:', data)
        /*         */
            });
    
        setMensagem('');
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[100],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/olympiastadion-berlin-1536x864.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: "rgba(33, 41, 48, 0.80)",
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList mensagens={listaDeMensagem} />
                    {/* {listaDeMensagem.map((mensagemAtual) => {
                        return (
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        )
                    })} */}
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    console.log(event);
                                    handleNovaMensagem(mensagem);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        {/* CallBack */}
                        < ButtonSendSticker
                        onStickerClick={(sticker) => {
                            //console.log('[USANDO O COMPONENTE] salva esse sticker no banco', sticker);
                            handleNovaMensagem(':sticker: ' + sticker);
                        }}
                        />
                        
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='light'
                    label='Sair'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    console.log(props);
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'auto',
                height: '100%',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        {mensagem.texto.startsWith(':sticker:')
                            ? (
                                <Image src={mensagem.texto.replace(':sticker:', '')}
                                    styleSheet={{
                                        maxWidth: '20vh'
                                    }}
                            />)    
                            : (
                                mensagem.texto
                            )}
                    {/*    {mensagem.texto} */}
                </Text>
                )
            })}

        </Box>
    )
}