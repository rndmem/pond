use crate::math::{R16, WH, WH16, XY, XY16};
use num::traits::cast::ToPrimitive;
use std::num::NonZeroI16;
use web_sys::Document;

pub struct Viewport {
  pub canvas_wh: WH16,
  pub scale: NonZeroI16,
  pub cam: R16,
}

impl Viewport {
  pub fn new(document: &Document) -> Self {
    let canvas_wh = canvas_wh(document);
    let scale = scale(&canvas_wh, &WH16 { w: 128, h: 128 }, 0);
    let cam_wh = cam_wh(&canvas_wh, scale);
    Self { canvas_wh, scale, cam: R16::cast(0, 0, cam_wh.w, cam_wh.h) }
  }
}

// is this what i want or do i want fixed scaling or osmething else?
/// Returns the maximum scale possible.
pub fn scale(canvas_wh: &WH16, min_size: &WH16, zoom_out: i16) -> NonZeroI16 {
  let x = canvas_wh.w / min_size.w;
  let y = canvas_wh.h / min_size.h;
  NonZeroI16::new(1.max(x.min(y) - zoom_out)).expect("Expected positive scale")
}

pub fn canvas_wh(document: &Document) -> WH16 {
  let root =
    document.document_element().expect("Document root element missing.");
  let w = root
    .client_width()
    .to_i16()
    .expect("Document root width i32 to i16 conversion failed.");
  let h = root
    .client_height()
    .to_i16()
    .expect("Document root height i32 to i16 conversion failed.");
  WH { w, h }
}

pub fn cam_wh(WH { w, h }: &WH16, scale: NonZeroI16) -> WH16 {
  let scale = f32::from(scale.get());
  WH {
    w: (w.to_f32().expect("Cam width i16 to f32 conversion failed.") / scale)
      .ceil()
      .to_i16()
      .expect("Cam width f32 to i16 conversion failed."),
    h: (h.to_f32().expect("Cam height i16 to f32 conversion failed.") / scale)
      .ceil()
      .to_i16()
      .expect("Cam height f32 to i16 conversion failed."),
  }
}

/// {x, y} The viewport coordinates of the input in window pixels,
///        usually new XY(event.clientX, event.clientY).
/// {w, h} The viewport dimensions in window pixels (canvasWH).
/// cam The coordinates and dimensions of the camera the input was made
///     through in level pixels.
/// Returns the fractional position in level coordinates.
pub fn to_level_xy(
  &XY { x, y }: &XY<i32>,
  &WH { w, h }: &WH16,
  cam: &R16,
) -> XY16 {
  XY {
    x: cam.from.x
      + ((x * i32::from(cam.width())) / i32::from(w)).to_i16().unwrap(),
    y: cam.from.y
      + ((y * i32::from(cam.height())) / i32::from(h)).to_i16().unwrap(),
  }
}