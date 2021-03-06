use serde::Deserialize;
use std::collections::HashMap;

#[derive(Deserialize)]
pub struct Font {
  /// Height of lines, including descenders, in pixels.
  pub letter_height: i16,

  /// Distance between lines in pixels.
  pub leading: i16,

  /// letterHeight + leading.
  pub line_height: i16,

  /// Distance between letters in pixels.
  kerning: HashMap<String, i16>,
  default_kerning: i16,
  whitespace_kerning: i16,
  end_of_line_kerning: i16,

  /// Character width in pixels.
  letter_width: HashMap<char, i16>,
  default_letter_width: i16,
}

impl Font {
  /// rhs None to indicate end of line.
  pub fn kerning(&self, lhs: char, rhs: Option<&char>) -> i16 {
    if rhs.is_none() {
      return self.end_of_line_kerning;
    }
    if lhs.is_whitespace() || rhs.unwrap().is_whitespace() {
      // is_blank()
      return self.whitespace_kerning;
    }
    let lhs_rhs = lhs.to_string() + &rhs.unwrap().to_string();
    *self.kerning.get(&lhs_rhs).unwrap_or(&self.default_kerning)
  }

  pub fn letter_width(&self, letter: char) -> i16 {
    *self.letter_width.get(&letter).unwrap_or(&self.default_letter_width)
  }
}
