class Intercode::Import::Intercode1::Tables::BidInfo < Intercode::Import::Intercode1::Table
  def initialize(connection, convention, constants_file)
    super connection

    @convention = convention
    @file_root = File.dirname(constants_file)
  end

  private

  def build_record(row)
    @convention.cms_partials.new(
      name: 'ProposalInfo',
      content: compose_partial_content(row)
    )
  end

  def compose_partial_content(row)
    html = Intercode::Import::Intercode1::HtmlConverter.new(
      html: row[:BidInfo],
      convention: @convention,
      file_root: @file_root
    ).convert

    <<-HTML
#{html}

<table class="table table-responsive">
  <thead>
    <tr>
      <th>Round</th>
      <th>Proposal Deadline</th>
      <th>Decision Date</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">First</th>
      <td>#{row[:FirstBid]}</td>
      <td>#{row[:FirstDecision]}</td>
    </tr>
    <tr>
      <th scope="row">Second</th>
      <td>#{row[:SecondBid]}</td>
      <td>#{row[:SecondDecision]}</td>
    </tr>
    <tr>
      <th scope="row">Third</th>
      <td>#{row[:ThirdBid]}</td>
      <td>#{row[:ThirdDecision]}</td>
    </tr>
  </tbody>
</table>
HTML
  end
end
