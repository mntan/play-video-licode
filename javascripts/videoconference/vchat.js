var localStream, room;

DEMO.init_demo = function (my_name) {

    var screen = getParameterByName("screen");
    localStream = Erizo.Stream({audio: true, video: true, data: true, screen: screen, attributes: {name: my_name}});
    DEMO.chat_stream = localStream;

    DEMO.create_token(my_name, "presenter", function (response) {

        var token = response;
        console.log(token);
        room = Erizo.Room({token: token});

        $( window ).resize(function (){
            DEMO.resizeVideos(localStream, room.remoteStreams);
        });

        localStream.addEventListener("access-accepted", function () {
            var subscribeToStreams = function (streams) {
                for (var index in streams) {
                    var stream = streams[index];
                    if (localStream.getID() !== stream.getID()) {
                        room.subscribe(stream);
                    }
                }
            };

            room.addEventListener("room-connected", function (roomEvent) {
                console.log('room-connected');
                room.publish(localStream);
                subscribeToStreams(roomEvent.streams);
            });

            room.addEventListener("stream-subscribed", function(streamEvent) {
                console.log('stream-subscribed');
                var stream = streamEvent.stream;

                add_div_to_grid("test" + stream.getID());
                stream.show("test" + stream.getID());
                DEMO.resizeVideos(localStream, room.remoteStreams);
            });

            room.addEventListener("stream-added", function (streamEvent) {
                console.log('stream-added');
                var streams = [];
                streams.push(streamEvent.stream);
                subscribeToStreams(streams);
            });

            room.addEventListener("stream-removed", function (streamEvent) {
                console.log('stream-removed');
                // Remove stream from DOM
                var stream = streamEvent.stream;
                if (stream.elementID !== undefined) {
                    remove_div_from_grid(stream.elementID, "video_grid");
                    DEMO.resizeVideos(localStream, room.remoteStreams);
                }
            });

            room.connect();

            localStream.show("my_video");
            DEMO.resizeVideos(localStream, room.remoteStreams);

        });
        localStream.init();
    });
};

var add_div_to_grid = function(divId) {
    var grid = document.getElementById('video_grid');
    var newDiv = document.createElement('div');
    newDiv.setAttribute("id", divId + '_container');
    newDiv.className = newDiv.className + " grid_element_border";

    var newDiv2 = document.createElement('div');
    newDiv2.setAttribute("id", divId);
    newDiv2.className = newDiv2.className + " grid_element";
    newDiv.appendChild(newDiv2);

    grid.appendChild(newDiv);

    // set height of videos
    var h = $(newDiv).width() * 0.75;
    $(newDiv).height(h);
};

var remove_div_from_grid = function(divId) {
    var grid = document.getElementById('video_grid');
    grid.removeChild(document.getElementById(divId + '_container'));
};
