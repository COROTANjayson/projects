import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_REGION || "",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_ID || "",
        secretAccessKey: process.env.AWS_SECRET_KEY || "",
    },
    apiVersion: "2012-10-17",
    maxAttempts: 3,
});

async function uploadFileToS3(file: File, fileName: string, type: string) {
    try {
        const fileBuffer = file;
        const uniqName = `wela-skillings/courses/coverphoto/${Date.now()}--${fileName}`;

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: uniqName,
            Body: fileBuffer,
            ACL: "public-read",
            ContentType: type,
        });
        await s3Client.send(command);

        return `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqName}`;
    } catch (err) {
        console.log("Error uploading file to S3", err);

        return "";
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.getAll("file") as File[];

        if (!file.length) {
            return NextResponse.json(
                { error: "File is required." },
                { status: 400 }
            );
        }

        const fileAwait = await file.map(async (eachFile) => {
            const buffer = Buffer.from(await eachFile.arrayBuffer());

            const fileURL = await uploadFileToS3(
                // @ts-ignore
                buffer,
                eachFile.name,
                eachFile.type
            );

            if (fileURL) {
                return fileURL;
            } else {
                return "";
            }
        });

        const filePromise = await Promise.all(fileAwait);

        return NextResponse.json({ success: true, files: filePromise });
    } catch (error) {
        return NextResponse.json({ success: false, error });
    }
}
