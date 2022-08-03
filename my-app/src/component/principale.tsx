import React, { useEffect, useState } from "react";
import * as AWS from "aws-sdk";
//type of props of tableOfData
interface data {
    age: AWS.Rekognition.AgeRange | undefined | string;
    emotion: AWS.Rekognition.Emotions | undefined | string;
    beard: AWS.Rekognition.Beard | undefined | string;
    smile: AWS.Rekognition.Smile | undefined | string;
    gender: AWS.Rekognition.Gender | undefined | string;
    moustache: AWS.Rekognition.Mustache | undefined | string;
    qualityOfImage: AWS.Rekognition.ImageQuality | undefined | string;
    landmark: AWS.Rekognition.Landmarks | undefined | string;
    sunglasses:  AWS.Rekognition.Sunglasses | undefined | string;
    glasses: AWS.Rekognition.Eyeglasses | undefined | string;
}
interface toShowType {
    toShow: AWS.Rekognition.AgeRange |
    AWS.Rekognition.Emotions |
    AWS.Rekognition.Beard |
    AWS.Rekognition.Smile |
    AWS.Rekognition.Mustache |
    AWS.Rekognition.ImageQuality |
    AWS.Rekognition.Sunglasses |
    AWS.Rekognition.Eyeglasses |
    undefined;
    label: string;
}
//display de table thata take all that shit
function TableOfData(props: data): React.ReactElement {
    const { age, emotion, beard, smile, gender, moustache, qualityOfImage, landmark , glasses , sunglasses} = props
    const [info, setInfo]: [string, Function] = useState("ShouldBedata");
    const [showData, setShowData]: [AWS.Rekognition.AgeRange |
        AWS.Rekognition.Emotions |
        AWS.Rekognition.Beard |
        AWS.Rekognition.Smile |
        AWS.Rekognition.Mustache |
        AWS.Rekognition.ImageQuality |
        undefined | string, Function] = useState(age)
    return (
        <div className="all_data">
            <div className="header_all_data">
                <h1>Information</h1>
            </div>
            <div className="board">
                <div className="showinfo">
                    <MiniButton name="Age" effect={setInfo} effect2={setShowData} value={age} />
                    <MiniButton name="Emotion" effect={setInfo} effect2={setShowData} value={emotion} />
                    <MiniButton name="Beard" effect={setInfo} effect2={setShowData} value={beard} />
                    <MiniButton name="Smile" effect={setInfo} effect2={setShowData} value={smile} />
                    <MiniButton name="Gender" effect={setInfo} effect2={setShowData} value={gender} />
                    <MiniButton name="Moustache" effect={setInfo} effect2={setShowData} value={moustache} />
                    <MiniButton name="Quality of image" effect={setInfo} effect2={setShowData} value={qualityOfImage} />
                    <MiniButton name="Landmarks" effect={setInfo} effect2={setShowData} value={landmark} />
                    <MiniButton name="Sunglasses" effect={setInfo} effect2={setShowData} value={sunglasses} />
                    <MiniButton name="Eyeglasses" effect={setInfo} effect2={setShowData} value={glasses} />
                </div>
                <MoreInformation label={info} toShow={showData} />
            </div>
        </div>
    )
}
function MoreInformation(props:{label:string,toShow:AWS.Rekognition.AgeRange |
    AWS.Rekognition.Emotions |
    AWS.Rekognition.Beard |
    AWS.Rekognition.Smile |
    AWS.Rekognition.Mustache |
    AWS.Rekognition.ImageQuality |
    undefined|string}): React.ReactElement {
    const { label, toShow } = props;

    return (
        <div className="data">
            <div className="label_info">
                <h2>{label}</h2>
            </div>
            {typeof toShow === typeof "" && <div>{toShow?.toString()}</div>}
            {(label === "Beard" || label === "Moustache" || label === "Smile" || label === "Gender" || label==="Sunglasses" || label==="Eyeglasses") && <Value_conf data={toShow} />}
            {label === "Age" && <Value_Age data={toShow} />}
            {label === "Quality of image" && <Quality data={toShow} />}
            {label === "Landmarks" && <Landmarks data={toShow} />}
            {label === "Emotion" && <Emotion data={toShow}/>}
        </div>
    )
}
function Value_conf(props: { data: any }): React.ReactElement {
    const { data } = props;
    return (<>
        <p>Value:{(() => (`${data.Value}`))()}</p><p>Confidence:{data.Confidence}</p>
    </>
    )
}
function Landmarks(props: { data: any | undefined }): React.ReactElement {
    const { data } = props;
    return (<>
        {data !==undefined&&data.map((i:any)=>(<><h4>Type:{i.Type}</h4><p>X:{i.X}</p><p>Y:{i.Y}</p></>))}
    </>
    )
}
function Emotion(props: { data: any | undefined }): React.ReactElement {
    const { data } = props;
    return (<>
        {data !==undefined&&data.map((i:any)=>(<><h4>{i.Type}</h4><p>Confidence:{i.Confidence}</p></>))}
    </>
    )
}
function Quality(props: { data: any }): React.ReactElement {
    const { data } = props;
    return (<>
        <p>Brightness:{data.Brightness}</p><p>Sharpness:{data.Brightness}</p>
    </>
    )
}
function Value_Age(props: { data: any }): React.ReactElement {
    const { data } = props;
    return (<>
        <p>High:{data.High}</p><p>Low:{data.Low}</p>
    </>
    )
}
function MiniButton(props: { name: string, effect: Function, effect2: Function, value: Object | AWS.Rekognition.Emotions | undefined }): React.ReactElement {
    const { name, effect, effect2, value } = props;
    function handleClick(): void {
        effect(name)
        effect2(value)
    }
    return (
        <div className="button">
            <div className="btn">
                {name}
                {value!=="no data for now" && <button onClick={handleClick}>show data</button>}
            </div>

        </div>
    )
}
export default function (): React.ReactElement {
    const [image, setImage]: [string | undefined, Function] = useState();
    const [imageData, setImageData]: [String | undefined, Function] = useState();
    const [returnedData, setReturnedData]: [AWS.Rekognition.FaceDetailList | undefined, Function] = useState();
    function AnonLog() {

        // Configure the credentials provider to use your identity pool
        AWS.config.correctClockSkew = true
        AWS.config.region = process.env.REACT_APP_REGION; // Region
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: process.env.REACT_APP_PULLID as string,
        });
        // Make the call to obtain credentials
    };
    //process the image for AWS rekorgnito 
    function ProcessImage(test: String | ArrayBuffer) {
        AnonLog();
        // Load base64 encoded image for display 
        console.log(test)
        const rekognito = new AWS.Rekognition();
        const params = {
            Image: {
                Bytes: test
            },
            Attributes: [
                'ALL',
            ]
        }
        rekognito.detectFaces(params, (err, data) => {
            if (err) {
                console.error(err);
                console.log("err");
            }
            if (!err) {
                setReturnedData(data.FaceDetails);
            }
        })
    }

    //execute when imageData is provide
    useEffect(() => {
        if (imageData !== undefined) {
            ProcessImage(imageData)
        }
    }, [imageData])

    //encode the image data as an arrayBuffer for rekognito
    function encodeImageDataAsArrayBuffer(element: any) {
        let file: Blob = element.files[0];
        let reader = new FileReader();
        reader.onloadend = function () {
            const url = reader.result
            setImageData(url)
        }
        reader.readAsArrayBuffer(file)
    }

    //this function is executed when you choose an image for input
    //      it take the url of the image and display the image 
    //      and call encodeImageDataAsArrayBuffer to turn this image into an array buffer
    function handlechange(e: any) {
        encodeImageDataAsArrayBuffer(e.target)
        const [file]: any = e.target.files;
        URL.createObjectURL(file)
        setImage(URL.createObjectURL(file));
    }
    const noData = "no data for now"
    //renders
    return (<>
        <div className="mini_root">


            <div className="for_table">
                <div className="for_img">
                    <div >
                        <label className="input_file"><div className="turn">+</div><input type="file" name="" id="" onChange={handlechange} hidden={true} /></label>
                    </div>
                    {
                        image !== undefined ?

                            <img src={image} alt="" className="image" />
                            :
                            <h4>Still no image</h4>}
                </div>
                {
                    returnedData !== undefined ? <TableOfData
                        age={returnedData[0].AgeRange}
                        beard={returnedData[0].Beard}
                        emotion={returnedData[0]?.Emotions}
                        gender={returnedData[0].Gender}
                        moustache={returnedData[0].Mustache}
                        qualityOfImage={returnedData[0].Quality}
                        smile={returnedData[0].Smile}
                        landmark={returnedData[0].Landmarks}
                        sunglasses={returnedData[0].Sunglasses}
                        glasses={returnedData[0].Eyeglasses}
                    />
                        :
                        <TableOfData
                            age={noData}
                            beard={noData}
                            emotion={noData}
                            gender={noData}
                            moustache={noData}
                            qualityOfImage={noData}
                            smile={noData}
                            landmark={noData}
                            sunglasses={noData}
                            glasses={noData}
                        />
                }
            </div>
        </div>
        </>
    )
}
