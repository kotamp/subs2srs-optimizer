(function() {
  window.addEventListener('load', function() {
    var area, handleDrop, output, process, progress, sentenceEnds;
    handleDrop = function(e) {
      var f, file, filename, i, m, ref;
      console.log("hi");
      e.preventDefault();
      if (e.dataTransfer.items) {
        file = null;
        filename = '';
        for (i = m = 0, ref = e.dataTransfer.items.length; (0 <= ref ? m < ref : m > ref); i = 0 <= ref ? ++m : --m) {
          f = e.dataTransfer.items[i].getAsFile();
          if (f.name.indexOf(".tsv") !== -1) {
            file = f;
            filename = f.name;
            break;
          }
        }
        if (file === null) {
          progress.innerHTML = 'not found .tsv file. Waiting...';
          return;
        } else {
          progress.innerHTML = "working...";
        }
        return file.text().then(function(t) {
          var a, b, end, img, j, len, len1, n, o, res, sound, tag, text, time;
          res = process(t);
          end = '';
          for (n = 0, len = res.length; n < len; n++) {
            i = res[n];
            tag = i[0].tag;
            time = [];
            sound = [];
            img = [];
            text = [];
            for (o = 0, len1 = i.length; o < len1; o++) {
              j = i[o];
              time.push(j.time);
              sound.push(j.sound);
              img.push(j.img);
              text.push(j.text);
            }
            end += tag + '\t';
            end += time.join(' ') + '\t';
            end += sound.join('') + '\t';
            end += img.join('') + '\t';
            end += text.join(' ') + '\r\n';
          }
          b = new Blob([end]);
          a = document.createElement("a");
          a.href = URL.createObjectURL(b);
          a.download = filename.slice(0, -4) + '_united.tsv';
          a.innerHTML = a.download;
          progress.innerHTML = 'complete! waiting...';
          return output.appendChild(a);
        });
      } else {
        return alert("e.dataTransfer are not supported! sorry");
      }
    };
    area = document.getElementById("input");
    area.addEventListener("drop", handleDrop);
    output = document.getElementById("output");
    progress = document.getElementById("progress");
    fetch("Bojack-S01E01.tsv").then(function(res) {
      return res.text();
    }).then(function(data) {
      return process(data);
    });
    sentenceEnds = function(str) {
      var t, t1, t2, t3;
      t = str;
      t1 = t.slice(-1);
      t2 = t.slice(-2);
      t3 = t.slice(-3);
      if (t2 === '."' || t2 === '?"' || t3 === '!"') {
        return true;
      }
      if (t3 === '...') {
        return true;
      }
      if (t2 === '--') {
        return true;
      }
      if (".?!♪]".indexOf(t1) !== -1) {
        return true;
      }
      return false;
    };
    return process = function(text) {
      var acc, db, el, f, i, k, l, len, len1, lines, m, n, t, updated_db;
      lines = text.split('\r\n');
      db = [];
      for (m = 0, len = lines.length; m < len; m++) {
        l = lines[m];
        if (l.length === 0) {
          continue;
        }
        el = l.split('\t');
        db.push({
          tag: el[0],
          time: el[1],
          sound: el[2],
          img: el[3],
          text: el[4]
        });
      }
      updated_db = [];
      acc = [];
      for (k = n = 0, len1 = db.length; n < len1; k = ++n) {
        i = db[k];
        t = i.text;
        f = sentenceEnds(t);
        acc.push(i);
        if (f) {
          updated_db.push(acc);
          acc = [];
        }
      }
      return updated_db;
    };
  });

}).call(this);
