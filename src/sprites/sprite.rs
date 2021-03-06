use super::{SpriteComposition, SpriteLayer};
use crate::atlas::{AnimationID, Animator, Atlas};
use crate::math::{Millis, R16, XY, XY16};
use std::{convert::TryInto, num::NonZeroI16};

/// A mapping from an Atlas Animation to a level region. This includes all
/// distinct state needed to represent an instance to the shader.
pub struct Sprite {
  /// The source Animation subtextures identifer to draw from.
  id: AnimationID,
  /// The Animation subtextures identifer to compose with source. The
  /// constituent uses the source Animator's period and as such cannot be
  /// animated distinctly. Wrapping is not applied to the constituent.
  constituent: AnimationID,
  /// The composition operator for source and constituent.
  composition: SpriteComposition,
  /// The level region to draw to including scale. The width and height are
  /// unsigned and never negative even when scaling indicates the sprite will be
  /// flipped when rendered.
  ///
  /// Each animation cel has the same size so an sprite's dimensions only change
  /// when explicitly instructed. Specifying a different destination width or
  /// height than the source truncates or repeats the scaled rendered source.
  ///
  /// This region is used to determine when the sprite is on screen and therefor
  /// should be drawn, as well as for rendering itself. The region is also used
  /// for certain collision tests.
  bounds: R16,
  /// The destination multiple.
  scale: XY<NonZeroI16>,
  /// The initial marquee translation offset in .1 pixels. The total offset is
  /// calculated using the global game clock and therefor synchronized by
  /// default except where this property deviates.
  /// [todo]: should this use a custom type or should everything be i32 and
  /// divide by 10 000 / 2^13? It's really easy to overflow i16 in general.
  /// E.g., area (width * height) would overflow 2^19 at on a 725px square. Even
  /// 2^24 can only go up to a 4096px square.
  wrap: XY16,
  /// The marquee translation speed in .1 pixels per second (or 1 px / 10 000 ms
  /// or 1 px / 10 s). The offset for each render is calculated by the shader as
  /// `wrap + wrap_velocity * game_clock`.
  wrap_velocity: XY16,
  /// The painting draw order.
  layer: i16,
  /// Source Animation state.
  animator: Animator,
}

impl Sprite {
  pub fn new(
    id: AnimationID,
    constituent: AnimationID,
    composition: SpriteComposition,
    bounds: R16,
    scale: XY<NonZeroI16>,
    wrap: XY16,
    wrap_velocity: XY16,
    layer: SpriteLayer,
    animator: Animator,
  ) -> Self {
    Self {
      animator,
      id,
      constituent,
      composition,
      bounds,
      scale,
      wrap,
      wrap_velocity,
      layer: layer as i16,
    }
  }

  pub fn animate(&mut self, atlas: &Atlas, exposure: Millis) {
    self.animator.animate(&atlas.animations[&self.id], exposure);
  }

  pub fn reset_animation(&mut self) {
    self.animator.reset();
  }

  pub fn get_id(&self) -> AnimationID {
    self.id
  }

  pub fn get_constituent(&self) -> AnimationID {
    self.constituent
  }

  pub fn get_composition(&self) -> SpriteComposition {
    self.composition
  }

  pub fn get_bounds(&self) -> &R16 {
    &self.bounds
  }

  pub fn move_by(&mut self, by: &XY16) {
    self.bounds = self.bounds.clone() + by.clone();
  }

  pub fn move_to(&mut self, to: &XY16) {
    self.bounds = self.bounds.move_to(to);
  }

  pub fn size_to(&mut self, unscaled_to: &XY16) {
    self.bounds.to = self.bounds.from.clone()
      + (unscaled_to.clone() * XY16::from(self.scale.clone()).abs()).into();
  }

  pub fn get_scale(&self) -> &XY<NonZeroI16> {
    &self.scale
  }

  pub fn scale_by(&mut self, by: &XY<NonZeroI16>) {
    let by: XY16 = by.clone().into();
    self.bounds.to = self.bounds.from.clone()
      + (self.bounds.to.clone() - self.bounds.from.clone()) * by.abs();
    let scale: XY16 = self.scale.clone().into();
    self.scale = (scale * by).try_into().expect("Scalar is zero.");
  }

  pub fn scale_to(&mut self, to: &XY<NonZeroI16>) {
    let scale: XY<f32> = self.scale.clone().into();
    self.scale = to.clone();
    let size: XY<f32> =
      (self.bounds.to.clone() - self.bounds.from.clone()).into();
    let scaled_wh = size * (XY::<f32>::from(to.clone()) / scale).abs();
    self.bounds.to = self.bounds.from.clone()
      + scaled_wh.try_into().expect("Size f32 to i16 conversion failed.");
  }

  pub fn get_wrap(&self) -> &XY16 {
    &self.wrap
  }

  pub fn wrap_to(&mut self, to: &XY16) {
    self.wrap = to.clone();
  }

  pub fn get_wrap_velocity(&self) -> &XY16 {
    &self.wrap_velocity
  }

  pub fn wrap_velocity_to(&mut self, to: &XY16) {
    self.wrap_velocity = to.clone();
  }

  pub fn get_layer(&self) -> i16 {
    self.layer
  }

  pub fn elevate_layer_to(&mut self, layer: i16) {
    self.layer = layer;
  }

  pub fn elevate_layer_by(&mut self, layer: i16) {
    self.layer += layer;
  }

  pub fn serialize(
    &self,
    config: &bincode::Config,
    atlas: &Atlas,
  ) -> bincode::Result<Vec<u8>> {
    let mut bytes = Vec::new();

    bytes.append(
      &mut config.serialize(
        &self
          .animator
          .cel(&atlas.animations[&self.id])
          .ok_or(bincode::ErrorKind::Custom("No source Cel.".to_string()))?
          .bounds,
      )?,
    );
    bytes.append(
      &mut config.serialize(
        &self
          .animator
          .cel(&atlas.animations[&self.constituent])
          .ok_or(bincode::ErrorKind::Custom("No constituent Cel.".to_string()))?
          .bounds,
      )?,
    );
    bytes.append(&mut config.serialize(&self.composition)?);
    bytes.append(&mut config.serialize(&self.bounds)?);
    bytes.append(&mut config.serialize(&self.scale)?);
    bytes.append(&mut config.serialize(&self.wrap)?);
    bytes.append(&mut config.serialize(&self.wrap_velocity)?);

    Ok(bytes)
  }
}

#[cfg(test)]
mod test {
  use super::*;
  use crate::atlas::{Animation, Cel, Playback};
  use std::collections::hash_map::HashMap;

  #[test]
  fn scale() {
    let mut sprite = Sprite::new(
      AnimationID::Bee,
      AnimationID::Bee,
      SpriteComposition::Source,
      R16::new_size(1, 2, 3, 4),
      (1, 1).try_into().unwrap(),
      XY::new(0, 0),
      XY::new(0, 0),
      SpriteLayer::Default,
      Animator::new(0, 0.),
    );

    assert_eq!(sprite.get_scale(), &(1, 1).try_into().unwrap());

    sprite.scale_by(&(2, 2).try_into().unwrap());
    assert_eq!(sprite.get_scale(), &(2, 2).try_into().unwrap());
    assert_eq!(sprite.get_bounds(), &R16::new_size(1, 2, 6, 8));

    sprite.scale_to(&(3, 3).try_into().unwrap());
    assert_eq!(sprite.get_scale(), &(3, 3).try_into().unwrap());
    assert_eq!(sprite.get_bounds(), &R16::new_size(1, 2, 9, 12));
  }

  #[test]
  fn wrap() {
    let mut sprite = Sprite::new(
      AnimationID::Bee,
      AnimationID::Bee,
      SpriteComposition::Source,
      R16::new(1, 2, 3, 4),
      (1, 1).try_into().unwrap(),
      XY::new(5, 6),
      XY::new(7, 8),
      SpriteLayer::Default,
      Animator::new(0, 0.),
    );

    assert_eq!(sprite.get_wrap(), &XY::new(5, 6));
    assert_eq!(sprite.get_wrap_velocity(), &XY::new(7, 8));

    sprite.wrap_to(&XY::new(9, 10));
    sprite.wrap_velocity_to(&XY::new(11, 12));
    assert_eq!(sprite.get_wrap(), &XY::new(9, 10));
    assert_eq!(sprite.get_wrap_velocity(), &XY::new(11, 12));
  }

  #[test]
  fn layer() {
    let mut sprite = Sprite::new(
      AnimationID::Bee,
      AnimationID::Bee,
      SpriteComposition::Source,
      R16::new(1, 2, 3, 4),
      (1, 1).try_into().unwrap(),
      XY::new(0, 0),
      XY::new(0, 0),
      SpriteLayer::Default,
      Animator::new(0, 0.),
    );

    assert_eq!(sprite.get_layer(), SpriteLayer::Default as i16);

    sprite.elevate_layer_by(SpriteLayer::UILo as i16);
    assert_eq!(
      sprite.get_layer(),
      (SpriteLayer::Default as i16) + (SpriteLayer::UILo as i16)
    );

    sprite.elevate_layer_to(SpriteLayer::Default as i16);
    assert_eq!(sprite.get_layer(), (SpriteLayer::Default as i16));
  }

  #[rustfmt::skip]
  #[test]
  fn serialize() {
    let mut animations = HashMap::new();
    let cels = vec![Cel {
      bounds: R16::new(7, 8, 12, 14),
      duration: 100.,
      slices: vec![],
    }];
    animations.insert(
      AnimationID::Bee,
      Animation {
        size: XY::new(5, 6),
        cels,
        duration: 100.,
        direction: Playback::Forward,
      },
    );
    let atlas = Atlas {
      version: "1.2.3.4".to_string(),
      filename: "atlas.png".to_string(),
      format: "I8".to_string(),
      size: XY::new(256, 256),
      animations,
    };
    let sprite = Sprite::new(
      AnimationID::Bee,
      AnimationID::Bee,
      SpriteComposition::SourceMask,
      R16::new(9, 10, 55, 72),
      (11, 13).try_into().unwrap(),
      XY::new(15, 16),
      XY::new(17, 18),
      SpriteLayer::UICursor,
      Animator::new(0, 0.),
    );
    let bytes =
      sprite.serialize(bincode::config().big_endian(), &atlas).unwrap();
    assert_eq!(
      bytes,
      vec![
        0, 7, 0, 8, 0, 12, 0, 14,
        0, 7, 0, 8, 0, 12, 0, 14,
        0, sprite.composition as u8,
        0, 9, 0, 10, 0, 55, 0, 72,
        0, 11, 0, 13,
        0, 15, 0, 16,
        0, 17, 0, 18
      ]
    );
  }
}
