/*
AI ACKNOWLEDGEMENT:
ChatGPT (OpenAI, 2026) assisted with generating, debugging
and restructuring parts of this code. The student tested
and modified the code for the final prototype.
*/


function preload() {
  preloadAudio();
}

function setup() {
  createCanvas(700, 700);
  setupAudio();
}

function draw() {
  background(24, 9, 20);

  let musicPulse =
    getMusicPulse();

  let pumpkinX = width / 2;
  let pumpkinY = 390;

  let pumpkinLobes =
    createPumpkinLobes(
      pumpkinX,
      pumpkinY
    );

  drawPumpkinBody(
    pumpkinLobes
  );

  drawPumpkinDots(
    pumpkinX,
    pumpkinY,
    pumpkinLobes,
    musicPulse
  );

  drawPumpkinStem(
    pumpkinX,
    pumpkinY
  );

  drawInstruction();
}

function createPumpkinLobes(x, y) {
  return [
    {
      x: x - 170,
      y: y + 18,
      width: 225,
      height: 370
    },
    {
      x: x + 170,
      y: y + 18,
      width: 225,
      height: 370
    },
    {
      x: x - 108,
      y: y + 10,
      width: 220,
      height: 402
    },
    {
      x: x + 108,
      y: y + 10,
      width: 220,
      height: 402
    },
    {
      x: x - 52,
      y: y + 4,
      width: 178,
      height: 418
    },
    {
      x: x + 52,
      y: y + 4,
      width: 178,
      height: 418
    },
    {
      x: x,
      y: y,
      width: 138,
      height: 426
    }
  ];
}

function drawPumpkinBody(
  pumpkinLobes
) {
  noStroke();
  fill(235, 125, 20);

  for (const lobe of pumpkinLobes) {
    ellipse(
      lobe.x,
      lobe.y,
      lobe.width,
      lobe.height
    );
  }
}

function drawPumpkinDots(
  pumpkinX,
  pumpkinY,
  pumpkinLobes,
  audioAmount
) {
  fill(5);
  noStroke();

  let pumpkinTop =
    pumpkinY - 213;

  let pumpkinBottom =
    pumpkinY + 213;

  let verticalSpacing = 27;
  let preferredHorizontalSpacing = 25;

  /*
    判断音乐当前是否正在播放。

    暂停时所有点恢复原始大小。
  */
  let musicIsPlaying =
    song &&
    song.isPlaying();

  let rowIndex = 0;

  for (
    let dotY = pumpkinTop + 7;
    dotY <= pumpkinBottom - 7;
    dotY += verticalSpacing
  ) {
    let halfWidth =
      getPumpkinHalfWidthAtY(
        pumpkinX,
        dotY,
        pumpkinLobes
      );

    let usableHalfWidth =
      halfWidth - 12;

    if (usableHalfWidth < 5) {
      rowIndex++;
      continue;
    }

    let dotCount =
      floor(
        (usableHalfWidth * 2) /
        preferredHorizontalSpacing
      ) + 1;

    if (dotCount % 2 === 0) {
      dotCount--;
    }

    dotCount = max(
      dotCount,
      1
    );

    let halfCount =
      (dotCount - 1) / 2;

    let verticalPosition =
      map(
        dotY,
        pumpkinTop,
        pumpkinBottom,
        -1,
        1
      );

    let middleAmount =
      sin(
        map(
          dotY,
          pumpkinTop,
          pumpkinBottom,
          0,
          PI
        )
      );

    let verticalPerspective =
      map(
        abs(verticalPosition),
        0,
        1,
        1,
        0.58,
        true
      );

    for (
      let columnIndex = -halfCount;
      columnIndex <= halfCount;
      columnIndex++
    ) {
      // 去掉每排最外侧的一对点
      if (
        halfCount > 1 &&
        abs(columnIndex) ===
          halfCount
      ) {
        continue;
      }

      // 收窄顶部肩部
      if (
        rowIndex <= 1 &&
        halfCount > 2 &&
        abs(columnIndex) ===
          halfCount - 1
      ) {
        continue;
      }

      // 最顶部不画中心点
      if (
        rowIndex === 0 &&
        columnIndex === 0
      ) {
        continue;
      }

      // 永久去掉最底部中心点
      let isBottomRow =
        dotY >
        pumpkinBottom -
        verticalSpacing;

      if (
        isBottomRow &&
        columnIndex === 0
      ) {
        continue;
      }

      let normalizedColumn;

      if (halfCount === 0) {
        normalizedColumn = 0;
      } else {
        normalizedColumn =
          columnIndex / halfCount;
      }

      let edgeAmount =
        abs(normalizedColumn);

      let compactAmount =
        0.76 +
        0.24 *
        pow(
          edgeAmount,
          1.5
        );

      let curvedColumn =
        normalizedColumn *
        compactAmount;

      let curveBoost =
        1 +
        middleAmount *
        (1 - abs(curvedColumn)) *
        0.17;

      let curvedPosition =
        curvedColumn *
        curveBoost;

      curvedPosition = constrain(
        curvedPosition,
        -1,
        1
      );

      let dotX =
        pumpkinX +
        curvedPosition *
        usableHalfWidth;

      let surfacePosition =
        abs(curvedPosition);

      /*
        控制大小点列的基础差别。
      */
      let ridge =
        pow(
          abs(
            cos(
              surfacePosition *
              PI *
              3.15
            )
          ),
          4.5
        );

      let sidePerspective =
        map(
          surfacePosition,
          0,
          1,
          1,
          0.72,
          true
        );

      /*
        小点基础尺寸保持不变。
      */
      let originalSize =
        3.5 +
        ridge *
        sidePerspective *
        verticalPerspective *
        16.5;

      /*
        只增加大点的基础尺寸。

        小点不会受到这个数值影响。
      */
      let largeDotBonus =
        pow(ridge, 2) *
        sidePerspective *
        verticalPerspective *
        3;

      originalSize +=
        largeDotBonus;

      /*
        外侧的小点至少保持 4.5 px。
      */
      let minimumSideSize =
        map(
          surfacePosition,
          0,
          1,
          3.5,
          4.5,
          true
        );

      originalSize = max(
        originalSize,
        minimumSideSize
      );

      /*
        中间一列保持：

        上小 → 中大 → 下小。
      */
      if (columnIndex === 0) {
        originalSize = lerp(
          4,
          22.5,
          pow(
            middleAmount,
            1.15
          )
        );
      }

      /*
        顶部边缘点仍然保持较小。
      */
      if (
        rowIndex <= 1 &&
        abs(columnIndex) >=
          halfCount - 2
      ) {
        originalSize = min(
          originalSize,
          5.5
        );
      }

      /*
        默认使用原始尺寸。

        因此音乐暂停时，
        所有点会恢复原始状态。
      */
      let dotSize =
        originalSize;

      if (musicIsPlaying) {
        /*
          小点变化范围：

          72% 到 145%。

          小点的变化会比较明显。
        */
        let smallDotScale =
          map(
            audioAmount,
            0,
            1,
            0.72,
            1.45
          );

        /*
          大点变化范围：

          82% 到 113%。

          大点仍会变化，
          但不会变得太拥挤。
        */
        let largeDotScale =
          map(
            audioAmount,
            0,
            1,
            0.82,
            1.13
          );

        /*
          根据原始点大小，
          在两种缩放幅度之间过渡。
        */
        let largeAmount =
          map(
            originalSize,
            3.5,
            22.5,
            0,
            1,
            true
          );

        let sizeScale =
          lerp(
            smallDotScale,
            largeDotScale,
            largeAmount
          );

        /*
          越靠南瓜两侧，
          动画幅度稍微减弱。
        */
        let depthAmount =
          map(
            surfacePosition,
            0,
            1,
            1,
            0.75,
            true
          );

        sizeScale =
          1 +
          (sizeScale - 1) *
          depthAmount;

        dotSize =
          originalSize *
          sizeScale;
      }

      /*
        横向弧线保持不变，
        继续表现南瓜表面的弯曲。
      */
      let horizontalArc =
        13 *
        cos(
          curvedPosition *
          PI
        );

      horizontalArc *=
        0.68 +
        middleAmount * 0.32;

      let curvedY =
        dotY +
        horizontalArc;

      /*
        音乐放大后的点如果超出边界，
        就逐渐缩小到可以容纳的尺寸。

        不会让整颗点突然消失。
      */
      while (
        dotSize > originalSize &&
        !isCircleInsidePumpkin(
          dotX,
          curvedY,
          dotSize / 2,
          pumpkinLobes
        )
      ) {
        dotSize -= 0.5;
      }

      /*
        缩小时只需要保证圆心仍在南瓜内。
      */
      if (
        isPointInsidePumpkin(
          dotX,
          curvedY,
          pumpkinLobes
        )
      ) {
        circle(
          dotX,
          curvedY,
          max(dotSize, 2)
        );
      }
    }

    rowIndex++;
  }
}

function getPumpkinHalfWidthAtY(
  pumpkinX,
  y,
  pumpkinLobes
) {
  let maximumDistance = 0;

  for (const lobe of pumpkinLobes) {
    let verticalDistance =
      (y - lobe.y) /
      (lobe.height / 2);

    if (abs(verticalDistance) <= 1) {
      let ellipseHalfWidth =
        (lobe.width / 2) *
        sqrt(
          1 -
          verticalDistance *
          verticalDistance
        );

      let leftEdge =
        lobe.x -
        ellipseHalfWidth;

      let rightEdge =
        lobe.x +
        ellipseHalfWidth;

      maximumDistance = max(
        maximumDistance,
        abs(leftEdge - pumpkinX),
        abs(rightEdge - pumpkinX)
      );
    }
  }

  return maximumDistance;
}

function isCircleInsidePumpkin(
  circleX,
  circleY,
  radius,
  pumpkinLobes
) {
  let numberOfChecks = 16;

  for (
    let i = 0;
    i < numberOfChecks;
    i++
  ) {
    let angle =
      (TWO_PI * i) /
      numberOfChecks;

    let testX =
      circleX +
      cos(angle) *
      radius;

    let testY =
      circleY +
      sin(angle) *
      radius;

    if (
      !isPointInsidePumpkin(
        testX,
        testY,
        pumpkinLobes
      )
    ) {
      return false;
    }
  }

  return true;
}

function isPointInsidePumpkin(
  pointX,
  pointY,
  pumpkinLobes
) {
  for (const lobe of pumpkinLobes) {
    let normalizedX =
      (pointX - lobe.x) /
      (lobe.width / 2);

    let normalizedY =
      (pointY - lobe.y) /
      (lobe.height / 2);

    let ellipseDistance =
      normalizedX * normalizedX +
      normalizedY * normalizedY;

    if (ellipseDistance <= 1) {
      return true;
    }
  }

  return false;
}

function drawPumpkinStem(x, y) {
  let pumpkinTop =
    y - 213;

  noStroke();
  fill(255, 194, 42);

  beginShape();

  vertex(
    x - 18,
    pumpkinTop + 4
  );

  vertex(
    x - 27,
    pumpkinTop - 57
  );

  vertex(
    x - 6,
    pumpkinTop - 82
  );

  vertex(
    x + 22,
    pumpkinTop - 59
  );

  vertex(
    x + 17,
    pumpkinTop + 4
  );

  endShape(CLOSE);

  fill(170, 88, 15, 150);

  beginShape();

  vertex(
    x + 5,
    pumpkinTop + 4
  );

  vertex(
    x + 2,
    pumpkinTop - 70
  );

  vertex(
    x + 22,
    pumpkinTop - 59
  );

  vertex(
    x + 17,
    pumpkinTop + 4
  );

  endShape(CLOSE);
}

function drawInstruction() {
  fill(255);
  noStroke();

  textSize(18);
  textAlign(CENTER);

  text(
    "Click the canvas to play or pause the music",
    width / 2,
    height - 25
  );
}

function mousePressed() {
  toggleAudio();
}