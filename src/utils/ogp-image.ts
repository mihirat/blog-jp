import { getCldOgImageUrl } from 'astro-cloudinary/helpers';

export function generateOgImageUrl(title: string) {
    return getCldOgImageUrl({
        src: 'krkyniwuclyojie7rt6f', // テンプレート画像のPublic ID
        text: {
            // テキストオーバーレイの設定
            color: '#333333',
            fontFamily: 'Sawarabi Gothic',
            fontSize: 50,
            fontWeight: 'bold',
            text: title,
            // width: 800,
        },
        // その他のオプション設定
        width: 1200,
        height: 630,
    });
}