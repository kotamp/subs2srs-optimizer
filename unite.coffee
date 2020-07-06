window.addEventListener 'load', ->
  handleDrop = (e) ->
    console.log("hi")
    do e.preventDefault

    if e.dataTransfer.items
      file = null
      filename = ''
      for i in [0...e.dataTransfer.items.length]
        f = e.dataTransfer.items[i].getAsFile()
        if f.name.indexOf(".tsv") != -1
          file = f
          filename = f.name
          break

      if file == null
        progress.innerHTML = 'not found .tsv file. Waiting...'
        return
      else
        progress.innerHTML = "working..."

      file.text()
      .then (t) ->
        res = process(t)
        end = ''

        for i in res
          tag = i[0].tag
          time = []
          sound = []
          img = []
          text = []

          for j in i
            time.push j.time
            sound.push j.sound
            img.push j.img
            text.push j.text

          end += tag + '\t'
          end += time.join(' ') + '\t'
          end += sound.join('') + '\t'
          end += img.join('') + '\t'
          end += text.join(' ') + '\r\n'


        b = new Blob([end])
        a = document.createElement "a"
        a.href = URL.createObjectURL(b)
        a.download = filename[0...-4]+'_united.tsv'
        a.innerHTML = a.download
        progress.innerHTML = 'complete! waiting...'
        output.appendChild(a)

    else
      alert "e.dataTransfer are not supported! sorry"



  area = document.getElementById "input"
  area.addEventListener("drop", handleDrop)
  output = document.getElementById "output"
  progress = document.getElementById "progress"


  sentenceEnds = (str) ->
    t = str
    t1 = t[-1..]
    t2 = t[-2..]
    t3 = t[-3..]
    if t2 == '."' or t2 == '?"' or t3 == '!"'
      return true

    if t3 == '...'
      return true

    if t2 == '--'
      return true

    if ".?!♪]".indexOf(t1) != -1
      return true
    
    return false


  process = (text) ->
    lines = text.split '\r\n'
    db = []

    for l in lines
      if l.length == 0 then continue
      el = l.split('\t')
      db.push 
        tag: el[0]
        time: el[1]
        sound: el[2]
        img: el[3]
        text: el[4]

    updated_db = []
    acc = []

    for i,k in db
      t = i.text
      f = sentenceEnds(t)
      acc.push(i)
      if f
        updated_db.push(acc)
        acc = []

    return updated_db