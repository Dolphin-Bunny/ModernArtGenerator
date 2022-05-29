window.addEventListener("load", () => {
    document.getElementById("fileinput").addEventListener("change", handle_files);
    document.getElementById('url').addEventListener("change", handle_url);
    document.querySelector("#img-method").addEventListener("change", handle_dropdown);
    //alert(document.querySelector("#img-method"));
    //img.onload = () => {document.querySelector("#output-canvas").getContext("2d").drawImage(img, 0, 0);};
});

window.addEventListener("error", alert)

function resize_canvas(w, h) {
    let canvas = document.querySelector("#output-canvas");
    let hcanvas = document.querySelector("#hidden_canvas");
    canvas.width = w;
    canvas.height = h;
    hcanvas.width = w;
    hcanvas.height = h;
    if (w > h) {
        canvas.style.height = "";
        canvas.style.width = "90%";
    } else {
        canvas.style.width = "";
        canvas.style.height = "90%";
    }

    //while (w > window.innerWidth || h > window.innerHeight) {
    //    w /= 1.1;
    //    h /= 1.1;
    //}
    //canvas.style.width = w + "px";
    //hcanvas.style.width = w + "px";
    //canvas.style.height = h + "px";
    //hcanvas.style.height = h + "px";
}

function handle_dropdown(e) {
    console.log(e.target.value);
    if (e.target.value == "file") {
        document.querySelector("#url").style.display = "none";
        document.querySelector("#fileinput").style.display = "block";
        document.querySelector("#camera-controls").style.display = "none";
        handle_files({target: document.querySelector("#fileinput")});
    } else if (e.target.value == "url") {
        document.querySelector("#url").style.display = "block";
        document.querySelector("#fileinput").style.display = "none";
        document.querySelector("#camera-controls").style.display = "none";
        handle_url({target: document.querySelector("#url")});
    } else if (e.target.value == "camera") {
        document.querySelector("#url").style.display = "none";
        document.querySelector("#fileinput").style.display = "none";
        document.querySelector("#camera-controls").style.display = "block";
    }
}

function handle_files(e) {
    console.log(e.target.files.length);
    if (e.target.files.length > 0) {
        console.log("drawing image");
        canvas = document.querySelector("#output-canvas");
        hcanvas = document.querySelector("#hidden_canvas");
        var ctx = canvas.getContext("2d");
        var hctx = hcanvas.getContext("2d");
        //var reader = new FileReader();
        var url = URL.createObjectURL(e.target.files[0]);
        var image = new Image();
        image.src = url;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hctx.clearRect(0, 0, canvas.width, canvas.height);
        image.onload = () => {resize_canvas(image.width, image.height); hctx.drawImage(image, 0, 0); ctx.drawImage(image, 00, 00); URL.revokeObjectURL(url);};
        //ctx.drawImage(image, 20, 20);
    }
}

function handle_url(e) {
    try {
        var image = new Image();
        image.crossOrigin = "Anonymous";
        image.src = e.target.value;
        console.log("drawing image");
        canvas = document.querySelector("#output-canvas");
        hcanvas = document.querySelector("#hidden_canvas");
        var ctx = canvas.getContext("2d");
        var hctx = hcanvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hctx.clearRect(0, 0, canvas.width, canvas.height);
        image.onload = () => {resize_canvas(image.width, image.height); hctx.drawImage(image, 0, 0); ctx.drawImage(image, 00, 00);};
    } catch (e) {
        alert(e);
        console.error(e);
    }
}

function start_camera(e) {
    navigator.mediaDevices.getUserMedia({audio: false, video: true}).then((stream)=>{console.log("media stream got sucessfully"); document.querySelector("video").srcObject = stream;}, (reason)=>{console.log("getUserMedia failed for reason " + reason)});
}

function take_picture(e) {
    video = document.querySelector("video");
    resize_canvas(video.videoWidth, video.videoHeight);
    canvas = document.querySelector("#output-canvas");
    hcanvas = document.querySelector("#hidden_canvas");
    ctx = canvas.getContext("2d");
    hctx = hcanvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    hctx.drawImage(video, 0, 0);
}

function stop_camera(e) {
    video = document.querySelector("video");
    video.srcObject.getTracks().forEach((track) => {
        track.stop();
    });
    video.srcObject = null;
}

function test_shape() {
    setOptionsEnabled(false)
    var progress = document.querySelector("progress");
    progress.value = 0;
    canvas = document.querySelector("#output-canvas");
    ctx = canvas.getContext("2d");
    hcanvas = document.querySelector("#hidden_canvas");
    hctx = hcanvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var max = 1000 * 10;
    count = 0;
    var sizeMultiplierSetting = document.querySelector("#shapeSize")
    var interval = setInterval(() => {
        for( var i = 0; i < 100; i++ ) {
            count++;
            draw_shape((max / count) * (canvas.width / 40) + (canvas.width / 60), ctx, canvas, hctx, hcanvas);
        }
        progress.value += 1;
        console.log(count + " " + (max / count) * (canvas.width / 40) + (canvas.width / 50) ); // + (canvas.width / 10))
        if (count >= max) {
            clearInterval(interval);
            //alert("Done!");
            setOptionsEnabled(true);
        }
    }, 100);
}

function draw_shape(size, ctx, canvas, hctx, hcanvas) {
    //console.log(size);
    sizeMul = Math.random() + 0.3;
    realSize = size * 1;//sizeMul;
    x = Math.floor( Math.random() * canvas.width );
    y = Math.floor( Math.random() * canvas.height );
    //ctx.fillStyle = "rgb(" + Math.random() * 255 + ", " + Math.random() * 255 + ", " + Math.random() * 255 + ")";
    color = hctx.getImageData(x, y, 1, 1).data;
    ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`;
    if (Math.random() >= 0.5) {
        //console.log("rectangle")
        ctx.fillRect(x-realSize/2, y-realSize/2, realSize, realSize);
    } else {
        //console.log("ellipse!")
        ctx.beginPath();
        //ctx.fillStyle = "red";
        ctx.ellipse(x, y, size/2, size/2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath()
    }
}


function setOptionsEnabled(state) {
    state = !state;
    document.querySelectorAll("input").forEach((e) => {e.disabled = state});
    if (state) {
        document.querySelector("a").href = "#";
    } else if (!state) {
        document.querySelector("a").href = document.querySelector("#output-canvas").toDataURL("image/jpeg");
    }
    document.querySelectorAll("button").forEach(e => e.disabled = state);
    document.querySelector("select").disabled = state;
}
