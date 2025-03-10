import { getCldOgImageUrl } from 'astro-cloudinary/helpers';

export function generateOgImageUrl(title: string) {
    const url = getCldOgImageUrl({
        src: 'krkyniwuclyojie7rt6f', // テンプレート画像のPublic ID
        text: {
            // テキストオーバーレイの設定
            color: '#333333',
            fontFamily: 'Sawarabi Gothic',
            fontSize: 50,
            fontWeight: 'bold',
            text: title,
        },
        // その他のオプション設定
        width: 1200,
        height: 630,
    });

    return url.replace(',co_rgb:333333', ',co_rgb:333333,c_fit,w_800');
}